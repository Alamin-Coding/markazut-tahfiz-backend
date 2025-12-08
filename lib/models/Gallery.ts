import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  title?: string;
  imageUrl: string;
  category?: string;
}

const GallerySchema: Schema<IGallery> = new Schema(
  {
    title: { type: String },
    imageUrl: { type: String, required: true },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

const Gallery: Model<IGallery> =
  mongoose.models.Gallery ||
  mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
