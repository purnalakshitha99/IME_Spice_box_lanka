import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    customization: {
      recipientName: String,
      message: String,
      senderName: String,
      packaging: String,
      ribbon: String,
      cardType: String,
    },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerSnapshot: {
      name: String,
      email: String,
      phone: String,
    },
    items: [orderItemSchema],
    customBox: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomSpiceBox' },
    personalization: {
      recipientName: String,
      message: String,
      senderName: String,
      packaging: String,
    },
    delivery: {
      address: String,
      city: String,
      district: String,
      postalCode: String,
      method: { type: String, default: 'Standard Delivery' },
      fee: { type: Number, default: 0 },
    },
    payment: {
      method: String,
      status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'COD', 'Bank Transfer'],
        default: 'Pending',
      },
      provider: String,
      paymentId: String,
    },
    pricing: {
      subtotal: Number,
      packaging: Number,
      customization: Number,
      delivery: Number,
      discount: Number,
      total: Number,
    },
    status: {
      type: String,
      enum: [
        'Order Placed',
        'Payment Confirmed',
        'Preparing',
        'Quality Checked',
        'Packed',
        'Dispatched',
        'Delivered',
        'Cancelled',
      ],
      default: 'Order Placed',
    },
  },
  { timestamps: true },
)

export const Order = mongoose.model('Order', orderSchema)

const corporateSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    numberOfBoxes: { type: Number, required: true, min: 1 },
    budgetPerBox: { type: Number, required: true, min: 0 },
    totalBudget: Number,
    estimatedValue: Number,
    occasion: String,
    deliveryDate: String,
    logoUrl: String,
    message: String,
    packaging: String,
    productPreferences: [String],
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        unitPrice: Number,
      },
    ],
    status: {
      type: String,
      enum: ['Quote Requested', 'In Review', 'Quoted', 'Confirmed', 'Fulfilled', 'Cancelled'],
      default: 'Quote Requested',
    },
    notes: String,
  },
  { timestamps: true },
)

export const CorporateOrder = mongoose.model('CorporateOrder', corporateSchema)

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    image: String,
  },
  { timestamps: true },
)

reviewSchema.index({ customer: 1, product: 1 }, { unique: true })

export const Review = mongoose.model('Review', reviewSchema)

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
    status: { type: String, default: 'New' },
  },
  { timestamps: true },
)

export const ContactEnquiry = mongoose.model('ContactEnquiry', contactSchema)
