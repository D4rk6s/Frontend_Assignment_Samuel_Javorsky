import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { MantineProviderWrapper } from "@/providers/MantineProvider";
import { I18nProvider } from "@/providers/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoodBoy Foundation - Support Slovak Dog Shelters",
  description: "Help us support Slovak dog shelters with your donation. Choose to donate to the foundation or a specific shelter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <QueryProvider>
            <MantineProviderWrapper>
              {children}
            </MantineProviderWrapper>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
