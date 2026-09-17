import mongoose from 'mongoose'

const giftBoxSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    basePrice: { type: Number, required: true },
    image: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    category: String,
    featured: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const GiftBox = mongoose.model('GiftBox', giftBoxSchema)

const customBoxSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    occasion: String,
    recipient: {
      type: { type: String },
      ageGroup: String,
      style: String,
      teaLover: Boolean,
      spiceLover: Boolean,
      foodLover: Boolean,
      cultureLover: Boolean,
      preferences: [String],
    },
    budget: Number,
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        priceAtAdd: Number,
        name: String,
      },
    ],
    packaging: { type: String, enum: ['Classic', 'Premium', 'Traditional', 'Luxury'], default: 'Classic' },
    ribbon: { type: String, enum: ['Standard', 'Premium'], default: 'Standard' },
    cardType: String,
    personalization: {
      recipientName: String,
      message: String,
      senderName: String,
    },
    packagingFee: { type: Number, default: 0 },
    customizationFee: { type: Number, default: 0 },
    productsTotal: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    saved: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const CustomSpiceBox = mongoose.model('CustomSpiceBox', customBoxSchema)
