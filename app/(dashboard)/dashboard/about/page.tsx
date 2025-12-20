"use client";

import React from "react";
import AboutPageContent from "@/components/AboutPageContent";
import { uploadToCloudinary } from "@/lib/utils/upload";

export default function DashboardAboutPage() {
	return <AboutPageContent uploadToCloudinary={uploadToCloudinary} />;
}
