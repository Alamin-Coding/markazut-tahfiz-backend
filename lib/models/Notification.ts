import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["email", "sms", "alert"],
			default: "alert",
		},
		title: { type: String, required: true, trim: true },
		message: { type: String, required: true, trim: true },
		payload: { type: Object, default: {} },
		status: {
			type: String,
			enum: ["pending", "sent", "failed"],
			default: "pending",
		},
		isRead: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

NotificationSchema.index({ createdAt: -1 });

const Notification =
	mongoose.models.Notification ||
	mongoose.model("Notification", NotificationSchema);

export default Notification;

