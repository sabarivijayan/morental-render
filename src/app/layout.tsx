"use client"
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/modules/user/common/footer/footer";
import Navbar from "@/modules/user/common/navbar/navbar";
import client from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import React from "react";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <ApolloProvider client={client}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ApolloProvider>
  );
}
