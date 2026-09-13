import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  variant?: Types.ObjectId | null;
  quantity: number;
  price: number;
  selectedSize?: string;
  metalPurity?: string;
  engravingText?: string;
  addedAt: Date;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  coupon?: Types.ObjectId | null;
  couponCode?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required in cart item"],
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Item price cannot be negative"],
    },
    selectedSize: {
      type: String,
      trim: true,
    },
    metalPurity: {
      type: String,
      trim: true,
    },
    engravingText: {
      type: String,
      trim: true,
      maxlength: [50, "Engraving cannot exceed 50 characters"],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Cart user is required"],
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, "Subtotal cannot be negative"],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, "Total amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Recalculate cart totals before save
cartSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  } else {
    this.subtotal = 0;
    this.discountAmount = 0;
    this.coupon = null;
    this.couponCode = undefined;
  }
  this.totalAmount = Math.max(0, this.subtotal - (this.discountAmount || 0) + (this.taxAmount || 0));
  next();
});

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
