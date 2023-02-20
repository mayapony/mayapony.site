"use client";
import Link from "next/link";
import { useState } from "react";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  const header = (
    <header className="my-6  rounded-lg bg-dracula-current p-5">
      <div className="text-center">
        <Link href="/">
          <h1 className="text-3xl font-bold text-dracula-foreground">
            maya&apos;s blog
          </h1>
        </Link>
        <p className="font-bold text-dracula-pink">️🔥 Welcome to my blog. 🫶</p>
        <button
          className="border-none bg-none text-gray-200"
          onClick={() => setDarkMode(!darkMode)}
        >
          👉{darkMode ? "🌕" : "🌞"}👈
        </button>
      </div>
    </header>
  );

  const footer = (
    <footer>
      <div className="my-10  border-t-2  border-gray-500 text-center text-dracula-comment">
        <h3>Designed by maya</h3>
      </div>
    </footer>
  );

  return (
    <html className={darkMode ? "dark" : ""}>
      <head />
      <body className={"bg-white px-4 dark:bg-dracula-background"}>
        <div className="mx-auto max-w-4xl">
          {header}
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
