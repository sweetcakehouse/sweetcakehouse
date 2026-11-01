import QRCode from 'qrcode';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getOrCreateSettings } from './settingsController.js';
import { fallbackProducts, fallbackOrders } from '../config/inMemoryStore.js';

// Helper to generate unique order number: SCH-YYYYMMDD-XXXX
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SCH-${dateStr}-${randomSuffix}`;
};

// Helper to format WhatsApp message string
export const formatWhatsAppMessage = (order, settings) => {
  let itemsText = '';
  if (order.items && order.items.length > 0) {
    itemsText = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (${item.weight}) - Flavor: ${item.flavor || 'Standard'}\n   Qty: ${item.quantity} | ₹${item.price * item.quantity}${
            item.cakeMessage ? `\n   Message on Cake: "${item.cakeMessage}"` : ''
          }${item.isEggless ? ' (Eggless)' : ''}`
      )
      .join('\n');
  }

  let customText = '';
  if (order.customCake && order.customCake.isCustom) {
    customText = `\n🎂 *Custom Cake Details:*\n- Theme/Name: ${order.customCake.cakeName}\n- Flavor: ${order.customCake.flavor}\n- Weight: ${order.customCake.weight}\n- Shape: ${order.customCake.shape}\n- Inscription: "${order.customCake.cakeMessage || 'N/A'}"\n- Notes: ${order.customCake.specialInstructions || 'None'}\n`;
  }

  const message =
    `🎂 *NEW ORDER PLACED at ${settings.shopName.toUpperCase()}* 🎂\n\n` +
    `📌 *Order Number:* ${order.orderNumber}\n` +
    `👤 *Customer Name:* ${order.customer.name}\n` +
    `📞 *Phone:* ${order.customer.phone}${order.customer.alternatePhone ? ` / ${order.customer.alternatePhone}` : ''}\n` +
    `📍 *Delivery Address:* ${order.customer.address}, ${order.customer.city} ${order.customer.pincode ? `(${order.customer.pincode})` : ''}\n` +
    (order.customer.landmark ? `   *Landmark:* ${order.customer.landmark}\n` : '') +
    `📅 *Delivery Date:* ${order.deliveryDate}\n` +
    `⏰ *Time Slot:* ${order.deliveryTimeSlot}\n\n` +
    `🍰 *Ordered Items:*\n${itemsText || 'Custom Order'}\n` +
    customText +
    `\n💳 *Payment & Bill Summary:*\n` +
    `- Subtotal: ₹${order.subtotal}\n` +
    `- Delivery Fee: ₹${order.deliveryCharge}\n` +
    `- *Total Amount:* ₹${order.totalAmount}\n` +
    `- Payment Method: ${order.payment.method}\n` +
    `- Payment Status: ${order.payment.status.toUpperCase()}\n` +
    (order.payment.utr ? `- UTR / Ref No: ${order.payment.utr}\n` : '') +
    (order.orderNotes ? `\n📝 *Order Notes:* ${order.orderNotes}\n` : '') +
    `\nThank you for choosing ${settings.shopName}! We are baking happiness for you. ❤️`;

  return message;
};

// @desc    Create new order (with server-side price validation)
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      items = [],
      customCake,
      deliveryDate,
      deliveryTimeSlot,
      orderNotes,
      payment = {},
    } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, mobile number, and delivery address are required.',
      });
    }

    if (!deliveryDate || !deliveryTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Delivery date and time slot are required.',
      });
    }

    const settings = await getOrCreateSettings();

    let computedSubtotal = 0;
    const validatedItems = [];

    // 1. Process regular items and calculate prices strictly from database
    if (items && items.length > 0) {
      for (const item of items) {
        let dbProduct = null;
        if (item.product) {
          if (mongoose.connection.readyState === 1) {
            dbProduct = await Product.findById(item.product);
          } else {
            dbProduct = fallbackProducts.find(
              (p) => p._id === item.product || p.slug === item.product
            );
          }
        }

        let unitPrice = 0;
        let itemName = item.name;
        let itemImage = item.image;

        if (dbProduct) {
          itemName = dbProduct.name;
          itemImage = dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : '';

          // Find price for the selected weight
          if (dbProduct.weightsWithPrices && dbProduct.weightsWithPrices.length > 0) {
            const matchedWeight = dbProduct.weightsWithPrices.find(
              (w) => w.weight.toLowerCase() === (item.weight || '').toLowerCase()
            );
            if (matchedWeight) {
              unitPrice = matchedWeight.price;
            } else {
              unitPrice = dbProduct.price || dbProduct.weightsWithPrices[0].price;
            }
          } else {
            unitPrice = dbProduct.price || 499;
          }
        } else {
          // If custom item passed without product id
          unitPrice = Number(item.price) || 500;
        }

        const qty = Math.max(1, parseInt(item.quantity) || 1);
        computedSubtotal += unitPrice * qty;

        validatedItems.push({
          product: dbProduct ? dbProduct._id : null,
          name: itemName,
          image: itemImage,
          weight: item.weight || '1 kg',
          flavor: item.flavor || 'Standard',
          price: unitPrice,
          quantity: qty,
          isEggless: item.isEggless !== undefined ? Boolean(item.isEggless) : true,
          cakeMessage: item.cakeMessage ? item.cakeMessage.trim() : '',
        });
      }
    }

    // 2. Process custom cake if provided
    let customCakeData = { isCustom: false };
    if (customCake && customCake.isCustom) {
      customCakeData = {
        isCustom: true,
        cakeName: customCake.cakeName || 'Custom Celebration Cake',
        flavor: customCake.flavor || 'Chocolate',
        weight: customCake.weight || '1 kg',
        shape: customCake.shape || 'Round',
        cakeMessage: customCake.cakeMessage || '',
        specialInstructions: customCake.specialInstructions || '',
        referenceImage: customCake.referenceImage || '',
      };

      // Base pricing for custom cake if ordered individually
      if (items.length === 0) {
        const weightNum = parseFloat(customCake.weight) || 1;
        const customBasePrice = Math.round(weightNum * 850);
        computedSubtotal += customBasePrice;
      }
    }

    if (computedSubtotal < settings.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${settings.minOrderAmount}. Current subtotal is ₹${computedSubtotal}.`,
      });
    }

    // Calculate delivery charge based on store settings
    let deliveryCharge = settings.deliveryCharge;
    if (settings.freeDeliveryAbove && computedSubtotal >= settings.freeDeliveryAbove) {
      deliveryCharge = 0;
    }

    const totalAmount = computedSubtotal + deliveryCharge;
    const orderNumber = generateOrderNumber();

    // Generate dynamic UPI URI
    const upiId = settings.upiId || 'sweetcakehouse@upi';
    const upiHolder = settings.upiHolderName || 'Sweet Cake House';
    const dynamicUpiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiHolder)}&am=${totalAmount}&tn=${orderNumber}&cu=INR`;

    // Generate QR code data URL dynamically
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(dynamicUpiUri, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 320,
        color: {
          dark: '#3E2723',
          light: '#FFFFFF',
        },
      });
    } catch (err) {
      console.warn('QR code generation failed, using fallback:', err.message);
    }

    const orderData = {
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        alternatePhone: customer.alternatePhone ? customer.alternatePhone.trim() : '',
        email: customer.email ? customer.email.trim() : '',
        address: customer.address.trim(),
        landmark: customer.landmark ? customer.landmark.trim() : '',
        city: customer.city || settings.city || 'City',
        pincode: customer.pincode ? customer.pincode.trim() : '',
      },
      items: validatedItems,
      customCake: customCakeData,
      deliveryDate,
      deliveryTimeSlot,
      orderNotes: orderNotes ? orderNotes.trim() : '',
      subtotal: computedSubtotal,
      deliveryCharge,
      totalAmount,
      payment: {
        method: 'UPI',
        upiId: upiId,
        utr: payment.utr ? payment.utr.trim() : '',
        screenshotUrl: payment.screenshotUrl || '',
        status: payment.utr ? 'submitted' : 'pending',
      },
      orderStatus: 'pending',
      whatsappSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let savedOrder;
    if (mongoose.connection.readyState === 1) {
      const newOrder = new Order(orderData);
      savedOrder = await newOrder.save();
    } else {
      orderData._id = 'order-' + Date.now();
      fallbackOrders.unshift(orderData);
      savedOrder = orderData;
    }

    // Generate WhatsApp text and URL
    const whatsappText = formatWhatsAppMessage(savedOrder, settings);
    const cleanWhatsAppNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(whatsappText)}`;

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder,
      paymentDetails: {
        upiId,
        upiHolderName: upiHolder,
        upiUri: dynamicUpiUri,
        qrCodeDataUrl,
        instructions: settings.paymentInstructions,
      },
      whatsapp: {
        number: cleanWhatsAppNumber,
        text: whatsappText,
        url: whatsappUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin with filters)
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res, next) => {
  try {
    const { search, status, paymentStatus, date, page = 1, limit = 50 } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = [...fallbackOrders];

      if (status && status !== 'all') {
        list = list.filter((o) => o.orderStatus === status);
      }

      if (paymentStatus && paymentStatus !== 'all') {
        list = list.filter((o) => o.payment && o.payment.status === paymentStatus);
      }

      if (date) {
        list = list.filter((o) => o.deliveryDate === date);
      }

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(s) ||
            (o.customer && o.customer.name.toLowerCase().includes(s)) ||
            (o.customer && o.customer.phone.includes(s)) ||
            (o.payment && o.payment.utr && o.payment.utr.toLowerCase().includes(s))
        );
      }

      const total = list.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginated = list.slice(skip, skip + parseInt(limit));

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)) || 1,
        orders: paginated,
      });
    }

    let query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query['payment.status'] = paymentStatus;
    }

    if (date) {
      query.deliveryDate = date;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { 'payment.utr': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or Order Number
// @route   GET /api/orders/:id
// @access  Public (Customer tracking) or Admin
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (mongoose.connection.readyState !== 1) {
      order = fallbackOrders.find(
        (o) => o._id === id || o.orderNumber.toUpperCase() === id.toUpperCase().trim()
      );
    } else {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }

      if (!order) {
        order = await Order.findOne({ orderNumber: id.toUpperCase().trim() });
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const settings = await getOrCreateSettings();
    const cleanWhatsAppNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const whatsappText = formatWhatsAppMessage(order, settings);
    const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(whatsappText)}`;

    // Generate QR code
    let qrCodeDataUrl = '';
    const dynamicUpiUri = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.upiHolderName)}&am=${order.totalAmount}&tn=${order.orderNumber}&cu=INR`;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(dynamicUpiUri, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 320,
        color: { dark: '#3E2723', light: '#FFFFFF' },
      });
    } catch (e) {}

    res.json({
      success: true,
      order,
      paymentDetails: {
        upiId: settings.upiId,
        upiHolderName: settings.upiHolderName,
        upiUri: dynamicUpiUri,
        qrCodeDataUrl,
        instructions: settings.paymentInstructions,
      },
      whatsapp: {
        number: cleanWhatsAppNumber,
        text: whatsappText,
        url: whatsappUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'ready_for_pickup',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const order = fallbackOrders.find((o) => o._id === id || o.orderNumber === id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      order.orderStatus = status;
      if (adminNotes !== undefined) order.adminNotes = adminNotes;
      order.updatedAt = new Date().toISOString();
      return res.json({
        success: true,
        message: `Order status updated to ${status} (memory mode)`,
        order,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;
    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    const updated = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manual payment verification by Admin
// @route   PUT /api/orders/:id/payment
// @access  Private (Admin)
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus, notes, rejectionReason } = req.body;

    const validPaymentStatuses = ['pending', 'submitted', 'verified', 'rejected'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const order = fallbackOrders.find((o) => o._id === id || o.orderNumber === id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      order.payment = order.payment || {};
      order.payment.status = paymentStatus;
      if (notes) order.payment.notes = notes;
      if (rejectionReason) order.payment.rejectionReason = rejectionReason;
      if (paymentStatus === 'verified') {
        order.payment.verifiedAt = new Date().toISOString();
        order.payment.verifiedBy = req.admin ? req.admin.name : 'Admin';
        if (order.orderStatus === 'pending') order.orderStatus = 'confirmed';
      } else if (paymentStatus === 'rejected') {
        order.payment.verifiedAt = new Date().toISOString();
        order.payment.verifiedBy = req.admin ? req.admin.name : 'Admin';
      }
      return res.json({
        success: true,
        message: `Payment status marked as ${paymentStatus} (memory mode)`,
        order,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.payment.status = paymentStatus;
    if (notes) order.payment.notes = notes;
    if (rejectionReason) order.payment.rejectionReason = rejectionReason;

    if (paymentStatus === 'verified') {
      order.payment.verifiedAt = new Date();
      order.payment.verifiedBy = req.admin ? req.admin.name : 'Admin';
      if (order.orderStatus === 'pending') {
        order.orderStatus = 'confirmed';
      }
    } else if (paymentStatus === 'rejected') {
      order.payment.verifiedAt = new Date();
      order.payment.verifiedBy = req.admin ? req.admin.name : 'Admin';
    }

    const updated = await order.save();

    res.json({
      success: true,
      message: `Payment status marked as ${paymentStatus}`,
      order: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer updates UTR reference
// @route   PUT /api/orders/:id/utr
// @access  Public
export const submitUtr = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { utr, screenshotUrl } = req.body;

    if (!utr && !screenshotUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either UTR reference number or payment screenshot.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const order = fallbackOrders.find((o) => o._id === id || o.orderNumber === id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      order.payment = order.payment || {};
      if (utr) order.payment.utr = utr.trim();
      if (screenshotUrl) order.payment.screenshotUrl = screenshotUrl;
      order.payment.status = 'submitted';
      return res.json({
        success: true,
        message: 'Payment details submitted for manual bakery verification. (memory mode)',
        order,
      });
    }

    let order = await Order.findById(id);
    if (!order) {
      order = await Order.findOne({ orderNumber: id.toUpperCase().trim() });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (utr) order.payment.utr = utr.trim();
    if (screenshotUrl) order.payment.screenshotUrl = screenshotUrl;
    order.payment.status = 'submitted';

    const updated = await order.save();

    res.json({
      success: true,
      message: 'Payment details submitted for manual bakery verification.',
      order: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const idx = fallbackOrders.findIndex((o) => o._id === id || o.orderNumber === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      fallbackOrders.splice(idx, 1);
      return res.json({
        success: true,
        message: 'Order deleted successfully (memory mode)',
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard metrics & stats
// @route   GET /api/orders/stats/overview
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const totalOrders = fallbackOrders.length;
      const pendingOrders = fallbackOrders.filter((o) => o.orderStatus === 'pending').length;
      const activeOrders = fallbackOrders.filter((o) =>
        ['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'].includes(o.orderStatus)
      ).length;
      const deliveredOrders = fallbackOrders.filter((o) => o.orderStatus === 'delivered').length;
      const pendingPaymentVerifications = fallbackOrders.filter(
        (o) => o.payment && o.payment.status === 'submitted'
      ).length;
      const totalRevenue = fallbackOrders
        .filter((o) => o.payment && o.payment.status === 'verified' && o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const recentOrders = fallbackOrders.slice(0, 10);
      const productCount = fallbackProducts.length;

      return res.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          pendingOrders,
          activeOrders,
          deliveredOrders,
          pendingPaymentVerifications,
          productCount,
        },
        recentOrders,
      });
    }

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const activeOrders = await Order.countDocuments({
      orderStatus: { $in: ['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery'] },
    });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const pendingPaymentVerifications = await Order.countDocuments({
      'payment.status': 'submitted',
    });

    // Calculate revenue from verified and completed orders
    const revenueAgg = await Order.aggregate([
      { $match: { 'payment.status': 'verified', orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Recent 10 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
    const productCount = await Product.countDocuments();

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        activeOrders,
        deliveredOrders,
        pendingPaymentVerifications,
        productCount,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};
