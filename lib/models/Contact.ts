import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		subtitle: {
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

const ContactInfoSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			enum: ["address", "phone", "email", "office_hours"],
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		details: {
			type: String,
			required: true,
			trim: true,
		},
		color: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const DepartmentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const ContactSubmissionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		subject: {
			type: String,
			required: true,
			trim: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Create models
const Hero = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);

const ContactInfo =
	mongoose.models.ContactInfo ||
	mongoose.model("ContactInfo", ContactInfoSchema);

const Department =
	mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

const ContactSubmission =
	mongoose.models.ContactSubmission ||
	mongoose.model("ContactSubmission", ContactSubmissionSchema);

export { Hero, ContactInfo, Department, ContactSubmission };
