import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		resetToken: {
			type: String,
			default: null,
		},
		resetTokenExpiry: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
