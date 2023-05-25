"use client";
import "./asserts/globals.css";
import { Header } from "./components/Header";

const footer = (
  <footer>
    <div className="my-10 text-right text-ctp-surface2">
      <h3>Designed by maya.🌸</h3>
    </div>
  </footer>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <title>mayapony</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
      <body className="h-full min-h-screen bg-ctp-base">
        <div className="mx-auto max-w-5xl py-6 px-5">
          <Header />
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
