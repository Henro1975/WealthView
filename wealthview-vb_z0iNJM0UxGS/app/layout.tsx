"use client"; // If it's already there
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // <--- THIS MUST BE AT THE TOP

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Made with App Studio",
  description: "A Pi Network chatbot",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  import Script from "next/script"; // Add this import at the very top of the file

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* This loads the Pi SDK so your app can talk to the Pi Network */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
  
