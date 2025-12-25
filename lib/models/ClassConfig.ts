import mongoose from "mongoose";

const ClassConfigSchema = new mongoose.Schema(
	{
		className: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		divisions: {
			type: [String],
			default: [],
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

export default mongoose.models.ClassConfig ||
	mongoose.model("ClassConfig", ClassConfigSchema);
