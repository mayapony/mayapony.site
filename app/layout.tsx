"use client";
import { LayoutHeader } from "@/components/LayoutHeader";
import Link from "next/link";
import { useState } from "react";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footer = (
    <footer>
      <div className="my-10 text-right text-ctp-surface2">
        <h3>Designed by maya</h3>
      </div>
    </footer>
  );

  return (
    <html>
      <head />
      <body className={"h-full bg-ctp-base px-4"}>
        <div className="mx-auto max-w-4xl">
          <LayoutHeader />
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
