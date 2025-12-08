import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  title: string;
  description: string;
  image?: string; // Legacy field for backward compatibility
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
}

const AboutSchema: Schema<IAbout> = new Schema(
  {
    title: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
    image: { type: String }, // Legacy field
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
  },
  { timestamps: true, strict: false }
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;


