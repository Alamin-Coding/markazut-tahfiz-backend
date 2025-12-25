import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		studentId: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		roll: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
		},
		guardianPhone: {
			type: String,
			required: true,
			trim: true,
		},
		guardianName: {
			type: String,
			trim: true,
		},
		admissionDate: {
			type: Date,
			required: true,
		},
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
		section: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ["active", "inactive", "passed", "left"],
			default: "active",
		},
		feePlan: {
			monthlyAmount: { type: Number, default: 0 },
			discount: { type: Number, default: 0 },
			scholarship: { type: Number, default: 0 },
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

StudentSchema.index({ studentId: 1 }, { unique: true });
StudentSchema.index({ roll: 1 });
StudentSchema.index({ name: 1, class: 1, section: 1 });
StudentSchema.index({ guardianPhone: 1 });

if (process.env.NODE_ENV === "development") {
	delete (mongoose.models as any).Student;
}

const Student =
	mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;
