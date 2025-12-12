import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpeech extends Document {
  name: string;
  role: string;
  message: string;
  image: string;
  subtitle: string;
  arabic: string;
  bengaliGreeting: string;
}

const SpeechSchema: Schema<ISpeech> = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
    subtitle: { type: String, default: "মারকাজুত তারফিজ উইনোয়ানানাল মাদ্রাসা" },
    arabic: { type: String, default: "بسم الله الرحمن الرحيم" },
    bengaliGreeting: { type: String, default: "আলাহামদুলিল্লাহ" },
  },
  { timestamps: true }
);

// Prevent model caching issues in development
if (mongoose.models.Speech) {
  delete mongoose.models.Speech;
}

const Speech: Model<ISpeech> = mongoose.model<ISpeech>("Speech", SpeechSchema);

export default Speech;
