import { Metadata } from "next";
import "./asserts/globals.css";
import { Header } from "./components/Header";

export const metadata: Metadata = {
  title: "mayapony",
  generator: "Next.js",
  applicationName: "mayapony.site",
  referrer: "origin-when-cross-origin",
  keywords: ["Next.js", "React", "Javascript", "Student"],
  authors: {
    name: "mayapony",
    url: "https://github.com/mayapony",
  },
  colorScheme: "light",
};

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
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
      <body className="bg-ctp-base">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col py-6 px-5">
          <Header />
          <div className="grow">{children}</div>
          {footer}
        </div>
      </body>
    </html>
  );
}
