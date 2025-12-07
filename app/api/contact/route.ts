import { NextRequest, NextResponse } from "next/server";
import { Hero, ContactInfo, Department } from "@/lib/models/Contact";
import dbConnect from "@/lib/db";

// GET /api/contact - Fetch contact information, departments, and hero data
export async function GET() {
	try {
		await dbConnect();

		const hero = await Hero.findOne({ isActive: true });

		const contactInfo = await ContactInfo.find({ isActive: true }).sort({
			order: 1,
		});

		const departments = await Department.find({ isActive: true }).sort({
			order: 1,
		});

		const response = NextResponse.json({
			success: true,
			data: {
				hero,
				contactInfo,
				departments,
			},
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error fetching contact data:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch contact data",
			},
			{ status: 500 }
		);
	}
}

// PUT /api/contact - Update hero, contact info or department
export async function PUT(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const { type, id, ...data } = body;

		let result;
		if (type === "hero") {
			const { title, subtitle } = data;
			if (!title || !subtitle) {
				return NextResponse.json(
					{
						success: false,
						message: "Title and subtitle are required for updating hero",
					},
					{ status: 400 }
				);
			}
			result = await Hero.findByIdAndUpdate(
				id,
				{
					title,
					subtitle,
				},
				{ new: true }
			);
		} else if (type === "contactInfo") {
			const { contactType, title, details, color, order = 0 } = data;
			if (!id || !contactType || !title || !details || !color) {
				return NextResponse.json(
					{
						success: false,
						message:
							"ID, contact type, title, details, and color are required for updating contact info",
					},
					{ status: 400 }
				);
			}
			result = await ContactInfo.findByIdAndUpdate(
				id,
				{
					type: contactType,
					title,
					details,
					color,
					order,
				},
				{ new: true }
			);
		} else if (type === "department") {
			const { name, phone, email, order = 0 } = data;
			if (!id || !name || !phone || !email) {
				return NextResponse.json(
					{
						success: false,
						message:
							"ID, name, phone, and email are required for updating department",
					},
					{ status: 400 }
				);
			}
			result = await Department.findByIdAndUpdate(
				id,
				{
					name,
					phone,
					email,
					order,
				},
				{ new: true }
			);
		} else {
			return NextResponse.json(
				{
					success: false,
					message:
						"Invalid type. Must be 'hero', 'contactInfo' or 'department'",
				},
				{ status: 400 }
			);
		}

		if (!result) {
			return NextResponse.json(
				{
					success: false,
					message: `${
						type === "hero"
							? "Hero"
							: type === "contactInfo"
							? "Contact info"
							: "Department"
					} not found`,
				},
				{ status: 404 }
			);
		}

		const response = NextResponse.json({
			success: true,
			data: result,
			message: `${
				type === "hero"
					? "Hero"
					: type === "contactInfo"
					? "Contact info"
					: "Department"
			} updated successfully`,
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error updating contact data:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update contact data",
			},
			{ status: 500 }
		);
	}
}

// DELETE /api/contact - Delete contact info or department
export async function DELETE(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type");
		const id = searchParams.get("id");

		if (!type || !id) {
			return NextResponse.json(
				{
					success: false,
					message: "Type and ID are required for deletion",
				},
				{ status: 400 }
			);
		}

		let result;
		if (type === "hero") {
			result = await Hero.findByIdAndDelete(id);
		} else if (type === "contactInfo") {
			result = await ContactInfo.findByIdAndDelete(id);
		} else if (type === "department") {
			result = await Department.findByIdAndDelete(id);
		} else {
			return NextResponse.json(
				{
					success: false,
					message:
						"Invalid type. Must be 'hero', 'contactInfo' or 'department'",
				},
				{ status: 400 }
			);
		}

		if (!result) {
			return NextResponse.json(
				{
					success: false,
					message: `${
						type === "contactInfo" ? "Contact info" : "Department"
					} not found`,
				},
				{ status: 404 }
			);
		}

		const response = NextResponse.json({
			success: true,
			message: `${
				type === "hero"
					? "Hero"
					: type === "contactInfo"
					? "Contact info"
					: "Department"
			} deleted successfully`,
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error deleting contact data:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to delete contact data",
			},
			{ status: 500 }
		);
	}
}

// POST /api/contact - Create contact info or department
export async function POST(request: NextRequest) {
	try {
		await dbConnect();

		const body = await request.json();
		const { type, ...data } = body;

		let result;
		if (type === "hero") {
			const { title, subtitle } = data;
			if (!title || !subtitle) {
				return NextResponse.json(
					{
						success: false,
						message: "Title and subtitle are required for hero",
					},
					{ status: 400 }
				);
			}
			result = new Hero({
				title,
				subtitle,
			});
		} else if (type === "contactInfo") {
			const { contactType, title, details, color, order = 0 } = data;
			if (!contactType || !title || !details || !color) {
				return NextResponse.json(
					{
						success: false,
						message:
							"Contact type, title, details, and color are required for contact info",
					},
					{ status: 400 }
				);
			}
			result = new ContactInfo({
				type: contactType,
				title,
				details,
				color,
				order,
			});
		} else if (type === "department") {
			const { name, phone, email, order = 0 } = data;
			if (!name || !phone || !email) {
				return NextResponse.json(
					{
						success: false,
						message: "Name, phone, and email are required for department",
					},
					{ status: 400 }
				);
			}
			result = new Department({
				name,
				phone,
				email,
				order,
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					message:
						"Invalid type. Must be 'hero', 'contactInfo' or 'department'",
				},
				{ status: 400 }
			);
		}

		await result.save();

		const response = NextResponse.json({
			success: true,
			data: result,
			message: `${
				type === "hero"
					? "Hero"
					: type === "contactInfo"
					? "Contact info"
					: "Department"
			} created successfully`,
		});
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type");
		return response;
	} catch (error) {
		console.error("Error creating contact data:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create contact data",
			},
			{ status: 500 }
		);
	}
}
