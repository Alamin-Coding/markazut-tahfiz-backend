import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
	{
		category: { type: String, required: true, trim: true },
		amount: { type: Number, required: true, min: 0 },
		date: { type: Date, required: true, default: Date.now },
		notes: { type: String, trim: true },
		payee: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });

const Expense =
	mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

export default Expense;

