import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    weight: {
      type: String,
      required: true,
      default: '1 kg',
    },
    flavor: {
      type: String,
      default: 'Standard',
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    isEggless: {
      type: Boolean,
      default: true,
    },
    cakeMessage: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const customCakeSchema = new mongoose.Schema(
  {
    isCustom: {
      type: Boolean,
      default: false,
    },
    cakeName: {
      type: String,
    },
    flavor: {
      type: String,
    },
    weight: {
      type: String,
    },
    shape: {
      type: String,
      enum: ['Round', 'Heart', 'Square', 'Tiered / Multi-tier', 'Number / Letter', 'Custom Theme'],
      default: 'Round',
    },
    cakeMessage: {
      type: String,
    },
    specialInstructions: {
      type: String,
    },
    referenceImage: {
      type: String,
    },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    alternatePhone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
    },
    landmark: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: 'City',
    },
    pincode: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      default: 'UPI',
    },
    upiId: {
      type: String,
      default: '',
    },
    utr: {
      type: String,
      trim: true,
      default: '',
    },
    screenshotUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'verified', 'rejected'],
      default: 'submitted',
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: String,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: customerSchema,
      required: true,
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    customCake: {
      type: customCakeSchema,
      default: () => ({ isCustom: false }),
    },
    deliveryDate: {
      type: String,
      required: [true, 'Delivery date is required'],
    },
    deliveryTimeSlot: {
      type: String,
      required: [true, 'Delivery time slot is required'],
    },
    orderNotes: {
      type: String,
      default: '',
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      type: paymentSchema,
      default: () => ({
        method: 'UPI',
        status: 'submitted',
      }),
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    whatsappSent: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast searching by customer phone, date, status
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
