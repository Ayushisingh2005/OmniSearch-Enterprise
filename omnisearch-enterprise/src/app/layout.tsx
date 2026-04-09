import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OmniSearch Enterprise",
  description: "Enterprise Semantic Search",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      {/* Added suppressHydrationWarning to stop the flashing */}
      <body className="min-h-full flex flex-col bg-slate-50" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
