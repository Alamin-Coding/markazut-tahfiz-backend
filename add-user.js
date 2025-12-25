require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function addUser() {
	await mongoose.connect(process.env.MONGODB_URI);

	const User = mongoose.model(
		"User",
		new mongoose.Schema({
			email: { type: String, required: true, unique: true, lowercase: true },
			password: { type: String, required: true },
		})
	);

	const email = "tahfizmirpur@gmail.com"; // Change this
	const plainPassword = "$Admin@60!!!"; // Change this

	const hashedPassword = await bcrypt.hash(plainPassword, 12);

	const user = new User({ email, password: hashedPassword });
	await user.save();

	console.log("User added successfully");
	process.exit();
}

addUser().catch(console.error);
