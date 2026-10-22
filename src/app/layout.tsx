import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MANGO | Range exercise",
  description: "Custom range selector with two interaction modes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
