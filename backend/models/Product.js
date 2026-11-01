import mongoose from 'mongoose';

const weightPriceSchema = new mongoose.Schema(
  {
    weight: {
      type: String,
      required: true, // e.g. "0.5 kg", "1 kg", "1.5 kg", "2 kg"
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cake name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Birthday Cakes',
        'Chocolate Cakes',
        'Cheesecakes',
        'Fruit Cakes',
        'Red Velvet',
        'Anniversary Cakes',
        'Eggless Cakes',
        'Designer Cakes',
        'Cupcakes & Pastries',
      ],
      default: 'Birthday Cakes',
    },
    images: {
      type: [String],
      default: [],
    },
    availableFlavors: {
      type: [String],
      default: ['Classic Vanilla', 'Belgian Chocolate', 'Dutch Truffle', 'Fresh Strawberry'],
    },
    availableWeights: {
      type: [String],
      default: ['0.5 kg', '1 kg', '1.5 kg', '2 kg'],
    },
    weightsWithPrices: {
      type: [weightPriceSchema],
      default: [
        { weight: '0.5 kg', price: 499 },
        { weight: '1 kg', price: 899 },
        { weight: '1.5 kg', price: 1299 },
        { weight: '2 kg', price: 1699 },
      ],
    },
    price: {
      type: Number,
      required: true, // Starting / baseline price for easy catalog sorting
      default: 499,
      min: 0,
    },
    isEggless: {
      type: Boolean,
      default: true,
    },
    egglessAvailability: {
      type: String,
      enum: ['100% Eggless', 'Contains Egg', 'Eggless Available on Request'],
      default: '100% Eggless',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 24,
    },
    ingredients: {
      type: [String],
      default: ['Fresh Dairy Cream', 'Belgian Cocoa', 'Madagascar Vanilla', 'Organic Flour', 'Pure Butter'],
    },
  },
  {
    timestamps: true,
  }
);

// Helper to auto-sync starting price from smallest weight price
productSchema.pre('save', function (next) {
  if (this.weightsWithPrices && this.weightsWithPrices.length > 0) {
    const minPrice = Math.min(...this.weightsWithPrices.map((item) => item.price));
    this.price = minPrice;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;

