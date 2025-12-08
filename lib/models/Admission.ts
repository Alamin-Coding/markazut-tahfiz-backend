import mongoose from "mongoose";

const AdmissionSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, lowercase: true },
		phone: { type: String, required: true, trim: true },
		guardianName: { type: String, trim: true },
		guardianPhone: { type: String, trim: true },
		class: { type: String, required: true, trim: true },
		previousSchool: { type: String, trim: true },
		address: { type: String, trim: true },
		status: {
			type: String,
			enum: ["pending", "reviewing", "accepted", "rejected"],
			default: "pending",
		},
		notes: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

AdmissionSchema.index({ status: 1, createdAt: -1 });

const Admission =
	mongoose.models.Admission || mongoose.model("Admission", AdmissionSchema);

export default Admission;

