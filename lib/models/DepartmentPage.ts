import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepartmentPage extends Document {
  header: {
    title: string;
    subtitle1: string;
    subtitle2: string;
  };
  intro: {
    title: string;
    description: string;
  };
  departments: Array<{
    name: string;
    description: string;
    icon: string;
    color: string;
    details: string;
    features: string[];
    targetAudience: string;
  }>;
  stats: {
    title: string;
    items: Array<{
      count: string;
      label: string;
    }>;
  };
  features: Array<{
    title: string;
    icon: string;
    items: string[];
  }>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

const DepartmentPageSchema: Schema<IDepartmentPage> = new Schema(
  {
    header: {
      title: { type: String, default: "আমাদের বিভাগসমূহ" },
      subtitle1: { type: String, default: "মারকাজুত তাহফীজ ইউটিবোয়ানানাল মাদরাসা" },
      subtitle2: { type: String, default: "উন্নত শিক্ষা ও ইসলামিক জ্ঞানের কেন্দ্র" },
    },
    intro: {
      title: { type: String, default: "আমাদের শিক্ষামূলক বিভাগ" },
      description: { type: String, default: "আমরা শিক্ষার্থীদের বিভিন্ন স্তর এবং আগ্রহ অনুযায়ী বিশেষায়িত শিক্ষা প্রদান করি।" },
    },
    departments: [
      {
        name: String,
        description: String,
        icon: String,
        color: String,
        details: String,
        features: [String],
        targetAudience: String,
      },
    ],
    stats: {
      title: { type: String, default: "আমাদের প্রতিষ্ঠানের পরিসংখ্যান" },
      items: [
        {
          count: String,
          label: String,
        },
      ],
    },
    features: [
      {
        title: String,
        icon: String, // Store icon name
        items: [String],
      },
    ],
    cta: {
      title: { type: String, default: "আপনার সন্তানকে ভর্তি করান" },
      description: { type: String, default: "আমাদের যেকোনো বিভাগে এখনই যোগাযোগ করুন" },
      buttonText: { type: String, default: "যোগাযোগ করুন" },
    },
  },
  { timestamps: true }
);

// Prevent model caching issues in development
if (mongoose.models.DepartmentPage) {
  delete mongoose.models.DepartmentPage;
}

const DepartmentPage: Model<IDepartmentPage> =
  mongoose.models.DepartmentPage || mongoose.model<IDepartmentPage>("DepartmentPage", DepartmentPageSchema);

export default DepartmentPage;
