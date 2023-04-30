"use client";
import Link from "next/link";
import { useState } from "react";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = (
    <header className="my-6  rounded-lg bg-ctp-crust p-5">
      <div className="text-center">
        <Link href="/">
          <h1 className="text-3xl font-bold text-ctp-text">maya&apos;s blog</h1>
        </Link>
        <p className="m-2 font-bold text-ctp-mauve">️🔥 Welcome to my blog. </p>
      </div>
    </header>
  );

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
          {header}
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
