"use client";

import React from "react";
import HomePageContent from "@/components/HomePageContent";
import { uploadToCloudinary } from "@/lib/utils/upload";

export default function DashboardHomePage() {
	return <HomePageContent uploadToCloudinary={uploadToCloudinary} />;
}
