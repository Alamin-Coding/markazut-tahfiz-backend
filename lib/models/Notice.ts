import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		date: {
			type: String,
			required: true,
		},
		content: {
			type: [String],
			required: true,
		},
		type: {
			type: String,
			enum: ["announcement", "event"],
			default: "announcement",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

const Notice = mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);

export default Notice;
