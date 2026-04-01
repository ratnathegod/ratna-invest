import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ratna-invest",
  description:
    "An investing planner foundation for mapping salary into taxes, take-home pay, and investing capacity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
