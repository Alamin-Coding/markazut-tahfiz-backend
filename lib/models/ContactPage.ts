import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactPage extends Document {
  header: {
    title: string;
    subtitle: string;
  };
  contactInfo: Array<{
    icon: string; // "MapPin", "Phone", "Mail", "Clock"
    title: string;
    details: string;
    color: string;
  }>;
  mapUrl: string;
  departments: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
  quickInfo: {
      title: string;
      description: string;
      socials: {
          facebook: string;
          twitter: string;
          linkedin: string;
      }
  };
}

const ContactPageSchema: Schema<IContactPage> = new Schema(
  {
    header: {
      title: { type: String, default: "আমাদের সাথে যোগাযোগ করুন" },
      subtitle: { type: String, default: "মারকাজুত তাহফীজ ইন্সটিটিউশনাল মাদরাসা" },
    },
    contactInfo: [
      {
        icon: String,
        title: String,
        details: String,
        color: String,
      },
    ],
    mapUrl: { type: String, default: "https://www.google.com/maps/embed?pb=..." },
    departments: [
      {
        name: String,
        phone: String,
        email: String,
      },
    ],
    quickInfo: {
        title: { type: String, default: "আমরা সবসময় আপনার সেবায় প্রস্তুত" },
        description: { type: String, default: "আপনার যেকোনো প্রশ্ন, পরামর্শ বা অভিযোগের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা ২৪ ঘন্টার মধ্যে আপনার জবাব দেব।" },
        socials: {
            facebook: { type: String, default: "#" },
            twitter: { type: String, default: "#" },
            linkedin: { type: String, default: "#" },
        }
    }
  },
  { timestamps: true }
);

if (mongoose.models.ContactPage) {
  delete mongoose.models.ContactPage;
}

const ContactPage: Model<IContactPage> =
  mongoose.models.ContactPage || mongoose.model<IContactPage>("ContactPage", ContactPageSchema);

export default ContactPage;
