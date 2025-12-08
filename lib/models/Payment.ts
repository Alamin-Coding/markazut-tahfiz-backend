import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
			required: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		paidAt: {
			type: Date,
			required: true,
			default: Date.now,
		},
		monthOf: {
			type: String,
			required: true, // e.g. "2025-02"
		},
		method: {
			type: String,
			enum: ["cash", "bkash", "nagad", "card", "bank", "other"],
			default: "cash",
		},
		reference: {
			type: String,
			trim: true,
		},
		notes: {
			type: String,
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

PaymentSchema.index({ student: 1, monthOf: 1 });
PaymentSchema.index({ paidAt: -1 });

const Payment =
	mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;

