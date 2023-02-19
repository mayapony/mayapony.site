import Link from "next/link";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const header = (
    <header className="my-6  rounded-lg bg-dracula-current p-5">
      <div className="text-center">
        <Link href="/">
          <h1 className="text-3xl font-bold text-dracula-foreground">
            maya&apos;s blog
          </h1>
        </Link>
        <p className="font-bold text-dracula-pink">️🔥 Welcome to my blog. 🫶</p>
      </div>
    </header>
  );

  const footer = (
    <footer>
      <div className="my-4 mt-6 border-t-2  border-gray-500 text-center text-dracula-comment">
        <h3>Designed by maya</h3>
      </div>
    </footer>
  );

  return (
    <html>
      <head />
      <body className="px-4 dark:bg-dracula-background">
        <div className="mx-auto max-w-4xl">
          {header}
          {children}
          {footer}
        </div>
      </body>
    </html>
  );
}
