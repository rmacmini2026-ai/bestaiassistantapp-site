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

const GA_ID = "G-YX5K6HX57V";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const year = new Date().getFullYear();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f2ea] text-zinc-950">
        <Script src="https://subscribe-forms.beehiiv.com/embed.js" strategy="afterInteractive" />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-black/10 px-6 py-6 text-center text-sm text-zinc-500 md:px-10 lg:px-16">
            © {year} Best AI Assistant App. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  );
}
