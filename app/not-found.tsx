"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Logo and Header */}
        <div className="mb-8">
          <div className="flex size-30 mx-auto rounded-full justify-center mb-4 border bg-white p-1">
            <Image
              src="/logo.png"
              width={1000}
              height={1000}
              alt="logo"
              className="rounded-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            মারকাজুত তাহফীজ
          </h1>
          <p className="text-gray-600 text-sm">
            আন্তর্জাতিক হিফজ শিক্ষা প্রতিষ্ঠান
          </p>
        </div>

        {/* Not Found Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <h2 className="text-6xl font-bold text-emerald-500 mb-4">404</h2>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            পৃষ্ঠাটি পাওয়া যায়নি
          </h3>
          <p className="text-gray-600 text-sm mb-8">
            দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নয় বা সরানো হয়েছে।
          </p>

          <Link
            href="/"
            className="w-full cursor-pointer bg-linear-to-r from-emerald-500 to-teal-600 bg-button text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
