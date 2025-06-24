"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4">
      <div className=" shadow-lg rounded-xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6  text-center">
          Expenses Tracking System
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Manage your expenses efficiently and securely.
        </p>
        <Link
          href="/auth"
          className="w-full bg-blue-600 hover:bg-blue-700  font-semibold py-3 rounded-lg transition mb-4 text-center"
        >
          Login / Register
        </Link>
        <div className="mt-6  text-xs text-center">
          &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
        </div>
      </div>
    </div>
  );
}
