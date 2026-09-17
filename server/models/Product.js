import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema(
  {
    title: String,
    ingredients: [String],
    steps: [String],
    serving: String,
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['Spices', 'Ceylon Tea', 'Traditional Snacks', 'Lifestyle', 'Gift Boxes', 'Premium Collection', 'Corporate Gifts'],
      required: true,
    },
    description: String,
    shortDescription: String,
    price: { type: Number, required: true },
    images: [String],
    stock: { type: Number, default: 0 },
    origin: String,
    ingredients: String,
    usage: String,
    storage: String,
    tags: [String],
    culturalStory: String,
    heritage: String,
    production: String,
    recipe: recipeSchema,
    qrPath: String,
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    dietary: [String],
    occasions: [String],
    interests: [String],
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

productSchema.virtual('stockStatus').get(function stockStatus() {
  if (this.stock <= 0) return 'Out of Stock'
  if (this.stock < 20) return 'Low Stock'
  return 'In Stock'
})

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

export const Product = mongoose.model('Product', productSchema)
