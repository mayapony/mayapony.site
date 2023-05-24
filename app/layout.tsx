"use client";
import "./asserts/globals.css";
import Head from "./components/Head";
import { Header } from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footer = (
    <footer>
      <div className="my-10 text-right text-ctp-surface2">
        <h3>Designed by maya.</h3>
      </div>
    </footer>
  );

  return (
    <html>
      <Head />
      <body className="h-full bg-ctp-base px-4">
        <div className="mx-auto max-w-4xl">
          <Header />
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
