import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISettings extends Document {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // percentage
  freeShippingThreshold: number;
  flatShippingRate: number;
  upiId?: string;
  upiPayeeName?: string;
  address?: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: "JEWELO Luxury Maison" },
    contactEmail: { type: String, default: "concierge@jewelo.com" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    currency: { type: String, default: "INR" },
    currencySymbol: { type: String, default: "₹" },
    taxRate: { type: Number, default: 3 }, // 3% GST
    freeShippingThreshold: { type: Number, default: 50000 },
    flatShippingRate: { type: Number, default: 500 },
    upiId: { type: String, default: "jewelo@upi" },
    upiPayeeName: { type: String, default: "JEWELO Jewels Pvt Ltd" },
    address: { type: String, default: "10, Royal Avenue, Bandra West, Mumbai, 400050" },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);
export default Settings;
