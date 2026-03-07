import mongoose from "mongoose";

const TermConfigSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.models.TermConfig ||
	mongoose.model("TermConfig", TermConfigSchema);
