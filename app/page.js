"use client";
import React from "react";
import Link from "next/link";




export default function Home() {
  return (
    <div>
      <p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Go to Dashboard
        </Link>
      </p>
     
    
    </div>
  );
}
