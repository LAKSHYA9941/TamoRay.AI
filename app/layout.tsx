import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { clerkGlowAppearance } from "@/app/(auth)/clerkTheme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tamoray AI",
  description: "Create stunning thumbnails with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={clerkGlowAppearance}>
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-white antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}