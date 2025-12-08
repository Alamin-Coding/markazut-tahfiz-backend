import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpeech extends Document {
  name: string;
  role: string;
  message: string;
  image: string;
}

const SpeechSchema: Schema<ISpeech> = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Speech: Model<ISpeech> =
  mongoose.models.Speech || mongoose.model<ISpeech>("Speech", SpeechSchema);

export default Speech;
