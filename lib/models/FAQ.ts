import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema(
	{
		question: {
			type: String,
			required: true,
			trim: true,
		},
		answer: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			default: "general",
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);

export default FAQ;
