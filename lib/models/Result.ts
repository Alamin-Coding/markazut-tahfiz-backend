import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	marks: {
		type: Number,
		required: true,
		min: 0,
	},
	total: {
		type: Number,
		required: true,
		min: 0,
	},
});

const ResultSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		roll: {
			type: mongoose.Schema.Types.Mixed, // Can be string or number
			required: true,
		},
		studentId: {
			type: String,
			trim: true,
		},
		division: {
			type: String,
			required: true,
			trim: true,
		},
		class: {
			type: String,
			required: true,
			trim: true,
		},
		term: {
			type: String,
			required: true,
			trim: true,
		},
		examYear: {
			type: String,
			required: true,
			trim: true,
		},
		totalMarks: {
			type: Number,
			required: true,
			min: 0,
		},
		subjects: [SubjectSchema],
		examDate: {
			type: String,
			required: true,
		},
		resultDate: {
			type: String,
			required: true,
		},
		principal: {
			type: String,
			required: true,
			trim: true,
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

// Add indexes for better query performance
ResultSchema.index({ term: 1, division: 1, class: 1, roll: 1, examYear: 1 });
ResultSchema.index({ createdAt: -1 });

if (process.env.NODE_ENV === "development") {
	delete (mongoose.models as any).Result;
}

const Result = mongoose.models.Result || mongoose.model("Result", ResultSchema);

export default Result;
