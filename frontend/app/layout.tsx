import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { StyleProvider } from "./style-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const ubuntu = Ubuntu({
  weight: "500",
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "AI Studio",
  description: "Assignment for Modelia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark w-full h-full">
      <body className={`${ubuntu.className} w-full h-full antialiased`}>
        <StyleProvider>
          <div className="absolute right-0 top-0 p-4">
            <ThemeToggle />
          </div>
          {children}
        </StyleProvider>
      </body>
    </html>
  );
}
