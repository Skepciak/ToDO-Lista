import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "ToDo Lista - Zarządzaj swoimi zadaniami",
  description: "Prosta i elegancka aplikacja do zarządzania listą zadań. Dodawaj, oznaczaj i usuwaj zadania z łatwością.",
  keywords: ["todo", "lista zadań", "produktywność", "organizacja"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
