import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { fallbackProducts } from '../config/inMemoryStore.js';

// Helper slug generator
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, eggless, featured, sort } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = [...fallbackProducts];

      if (category && category !== 'All' && category !== 'all') {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            (p.availableFlavors && p.availableFlavors.some((f) => f.toLowerCase().includes(s)))
        );
      }

      if (eggless === 'true') {
        list = list.filter((p) => p.isEggless === true);
      }

      if (featured === 'true') {
        list = list.filter((p) => p.isFeatured === true);
      }

      if (sort === 'price-asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'popular') {
        list.sort((a, b) => b.reviewCount - a.reviewCount);
      }

      return res.json({
        success: true,
        count: list.length,
        products: list,
      });
    }

    let query = {};
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { availableFlavors: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (eggless === 'true') {
      query.isEggless = true;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'popular') {
      sortOption = { reviewCount: -1 };
    }

    const products = await Product.find(query).sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const product = fallbackProducts.find(
        (p) => p._id === id || p.slug.toLowerCase() === id.toLowerCase()
      );
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Cake product not found',
        });
      }
      return res.json({
        success: true,
        product,
      });
    }

    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Cake product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      images,
      availableFlavors,
      availableWeights,
      weightsWithPrices,
      isEggless,
      egglessAvailability,
      inStock,
      isFeatured,
      rating,
    } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and category are required.',
      });
    }

    let baseSlug = slugify(name);
    let slug = baseSlug;

    if (mongoose.connection.readyState !== 1) {
      const newProduct = {
        _id: 'prod-' + Date.now(),
        name,
        slug,
        description,
        category,
        images: images || [],
        availableFlavors: availableFlavors || ['Classic Vanilla', 'Belgian Chocolate'],
        availableWeights: availableWeights || ['0.5 kg', '1 kg'],
        weightsWithPrices: weightsWithPrices || [
          { weight: '0.5 kg', price: 499 },
          { weight: '1 kg', price: 899 },
        ],
        price: weightsWithPrices && weightsWithPrices[0] ? weightsWithPrices[0].price : 499,
        isEggless: isEggless !== undefined ? isEggless : true,
        egglessAvailability: egglessAvailability || '100% Eggless',
        inStock: inStock !== undefined ? inStock : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        rating: rating || 4.9,
        reviewCount: 1,
        createdAt: new Date().toISOString(),
      };
      fallbackProducts.unshift(newProduct);
      return res.status(201).json({
        success: true,
        message: 'Cake created successfully (memory mode)',
        product: newProduct,
      });
    }

    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const product = new Product({
      name,
      slug,
      description,
      category,
      images: images || [],
      availableFlavors: availableFlavors || ['Classic Vanilla', 'Belgian Chocolate'],
      availableWeights: availableWeights || ['0.5 kg', '1 kg'],
      weightsWithPrices: weightsWithPrices || [
        { weight: '0.5 kg', price: 499 },
        { weight: '1 kg', price: 899 },
      ],
      isEggless: isEggless !== undefined ? isEggless : true,
      egglessAvailability: egglessAvailability || '100% Eggless',
      inStock: inStock !== undefined ? inStock : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      rating: rating || 4.9,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Cake created successfully',
      product: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const idx = fallbackProducts.findIndex((p) => p._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Cake product not found' });
      }
      fallbackProducts[idx] = { ...fallbackProducts[idx], ...req.body };
      return res.json({
        success: true,
        message: 'Cake updated successfully (memory mode)',
        product: fallbackProducts[idx],
      });
    }

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Cake product not found',
      });
    }

    if (req.body.name && req.body.name !== product.name) {
      req.body.slug = slugify(req.body.name);
    }

    Object.assign(product, req.body);
    const updated = await product.save();

    res.json({
      success: true,
      message: 'Cake updated successfully',
      product: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const idx = fallbackProducts.findIndex((p) => p._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Cake product not found' });
      }
      fallbackProducts.splice(idx, 1);
      return res.json({
        success: true,
        message: 'Cake deleted successfully (memory mode)',
      });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Cake product not found',
      });
    }

    res.json({
      success: true,
      message: 'Cake deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
