import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import GettingThemeScript from "@/components/GettingThemeScript";
import { FileSystemProvider } from "@/components/filesystem/context/FileSystemProvider";
import FileSystemInspectorPanel from "@/components/filesystem/ui/inspector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bosta Drive",
  description: "Bosta Drive is a cloud storage solution for Bosta",
  icons: {
    icon: "/bosta-logo.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <GettingThemeScript />
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <FileSystemProvider>
          <Header />
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            {children}
            <FileSystemInspectorPanel />
          </div>
        </FileSystemProvider>
      </body>
    </html>
  );
}
