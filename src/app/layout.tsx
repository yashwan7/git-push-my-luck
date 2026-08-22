import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nayan — gaze-controlled everyday access",
  description:
    "A browser-based gaze and blink interface for people with dyskinetic cerebral palsy, built for CODEFURY 9.0.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-ui">{children}</body>
    </html>
  );
}
