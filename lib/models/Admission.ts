import mongoose from "mongoose";

const AdmissionSchema = new mongoose.Schema(
	{
		nameBangla: { type: String, required: true, trim: true },
		nameEnglish: { type: String, required: true, trim: true },
		fatherName: { type: String, required: true, trim: true },
		motherName: { type: String, required: true, trim: true },
		presentAddress: { type: String, required: true, trim: true },
		permanentAddress: { type: String, required: true, trim: true },
		exMadrasa: { type: String, trim: true },
		lastClass: { type: String, trim: true },
		admissionClass: { type: String, required: true, trim: true },
		admissionDepartment: { type: String, required: true, trim: true },
		guardianName: { type: String, required: true, trim: true },
		guardianPhone: { type: String, required: true, trim: true },
		guardianRelation: { type: String, trim: true },
		photo: { type: String }, // URL to uploaded photo
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
