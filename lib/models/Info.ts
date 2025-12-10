import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInfo extends Document {
  info1Quantity: number;
  info1Title: string;
  info2Quantity: number;
  info2Title: string;
  info3Quantity: number;
  info3Title: string;
  info4Quantity: number;
  info4Title: string;
  backgroundImage?: string;
}

const InfoSchema: Schema<IInfo> = new Schema(
  {
    info1Quantity: { type: Number, required: true, default: 50 },
    info1Title: { type: String, required: true, default: "+ অভিজ্ঞ উস্তাদ " },
    info2Quantity: { type: Number, required: true, default: 20 },
    info2Title: { type: String, required: true, default: "কর্মচারী" },
    info3Quantity: { type: Number, required: true, default: 300 },
    info3Title: { type: String, required: true, default: "বালক" },
    info4Quantity: { type: Number, required: true, default: 100 },
    info4Title: { type: String, required: true, default: "বালিকা" },
    backgroundImage: { type: String },
  },
  { timestamps: true }
);

const Info: Model<IInfo> =
  (mongoose.models.Info as Model<IInfo>) || 
  mongoose.model<IInfo>("Info", InfoSchema);

// Handle hot reloading in development
if (process.env.NODE_ENV === "development") {
   // This is a workaround to ensure schema changes are picked up
   if (mongoose.models.Info) {
      delete mongoose.models.Info;
   }
}

export default mongoose.model<IInfo>("Info", InfoSchema);
