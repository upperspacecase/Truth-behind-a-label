import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "truth label — see what the packet would say if it had to tell the truth",
  description:
    "Drop in a photo of any snack, drink, or healthy product. We decode the packaging, spot the persuasion tricks, and rewrite the front label in plain English.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
