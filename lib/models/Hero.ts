import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHero extends Document {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
}

const HeroSchema: Schema<IHero> = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    backgroundImage: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
  },
  { timestamps: true }
);

const Hero: Model<IHero> =
  mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;
