import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Best AI Assistant App | AI Assistants, Agents, Voice & Automation News",
  description:
    "Daily coverage of AI assistants, AI agents, AI voice assistants, automation systems, remote virtual assistants, and assistant apps.",
  openGraph: {
    title: "Best AI Assistant App",
    description:
      "Daily coverage of AI assistants, AI agents, AI voice assistants, automation systems, remote virtual assistants, and assistant apps.",
    type: "website",
    siteName: "Best AI Assistant App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best AI Assistant App",
    description:
      "Daily coverage of AI assistants, AI agents, AI voice assistants, automation systems, remote virtual assistants, and assistant apps.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script src="https://subscribe-forms.beehiiv.com/embed.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
