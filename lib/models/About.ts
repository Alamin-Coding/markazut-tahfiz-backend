import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAbout extends Document {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  mission: {
    title: string;
    content: string;
  };
  vision: {
    title: string;
    content: string;
  };
  history: {
    title: string;
    paragraphs: string[];
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
  }>;
  programs: Array<{
    title: string;
    duration: string;
    description: string;
  }>;
  values: Array<{
    title: string;
    description: string;
  }>;
  facilities: Array<{
    title: string;
    description: string;
  }>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

const AboutSchema: Schema<IAbout> = new Schema(
  {
    hero: {
      title: { type: String, default: "আমাদের সম্পর্কে" },
      subtitle: { type: String, default: "মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসার ইতিহাস ও মিশন" },
      backgroundImage: { type: String, default: "" },
    },
    mission: {
      title: { type: String, default: "মিশন:" },
      content: { type: String, default: "" },
    },
    steps: [{
      number: String,
      title: String,
      icon: String,
    }],
    vision: {
      title: { type: String, default: "ভিশন:" },
      content: { type: String, default: "" },
    },
    history: {
      title: { type: String, default: "প্রতিষ্ঠানের ইতিহাস" },
      paragraphs: { type: [String], default: [] },
    },
    features: [{
      title: String,
      description: String,
      icon: String,
    }],
    achievements: [{
      title: String,
      description: String,
    }],
    programs: [{
      title: String,
      duration: String,
      description: String,
    }],
    values: [{
      title: String,
      description: String,
    }],
    facilities: [{
      title: String,
      description: String,
    }],
    cta: {
      title: { type: String, default: "আমাদের সাথে যোগ দিন" },
      description: { type: String, default: "" },
      buttonText: { type: String, default: "এখনই ভর্তি আবেদন করুন" },
    },
  },
  { timestamps: true, strict: false }
);

const About: Model<IAbout> = mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;


