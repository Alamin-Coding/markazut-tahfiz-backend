import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		total: {
			type: Number,
			default: 100,
		},
	},
	{ _id: false },
);

const SubjectConfigSchema = new mongoose.Schema(
	{
		department: {
			type: String,
			required: true,
			trim: true,
		},
		class: {
			type: String,
			required: true,
			trim: true,
		},
		subjects: {
			type: [SubjectSchema],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

// Ensure a class within a department only has one configuration
SubjectConfigSchema.index({ department: 1, class: 1 }, { unique: true });

export default mongoose.models.SubjectConfig ||
	mongoose.model("SubjectConfig", SubjectConfigSchema);
