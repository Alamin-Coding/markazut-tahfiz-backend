import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
	{
		source: { type: String, required: true, trim: true },
		amount: { type: Number, required: true, min: 0 },
		date: { type: Date, required: true, default: Date.now },
		notes: { type: String, trim: true },
		category: { type: String, trim: true, default: "general" },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

IncomeSchema.index({ date: -1 });
IncomeSchema.index({ category: 1 });

const Income = mongoose.models.Income || mongoose.model("Income", IncomeSchema);

export default Income;

