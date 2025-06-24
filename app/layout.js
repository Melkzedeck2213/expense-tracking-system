import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Expense tracking system",
  description: "A simple expense tracking system built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       
      >
        {children}
      </body>
    </html>
  );
}
