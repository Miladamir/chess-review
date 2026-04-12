import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: {
    default: "ChessInsight | Professional Chess Analysis",
    template: "%s | ChessInsight"
  },
  description: "Master your chess games with world-class Stockfish analysis. Identify blunders, brilliant moves, and improve your game for free.",
  keywords: ["chess", "analysis", "stockfish", "chess.com", "lichess", "review", "open source", "engine"],
  authors: [{ name: "ChessInsight Team" }],
  creator: "ChessInsight",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chessinsight.app", // Replace with actual domain
    siteName: "ChessInsight",
    title: "ChessInsight | Free Chess Analysis",
    description: "Free, powerful chess game review platform powered by Stockfish.",
    images: [
      {
        url: "/images/logo.png", // Ensure this exists
        width: 1200,
        height: 630,
        alt: "ChessInsight Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChessInsight | Professional Chess Analysis",
    description: "Master your chess games with world-class Stockfish analysis.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-900 text-slate-50 antialiased">
        <Providers>
          {children}
          <Toast />
        </Providers>
      </body>
    </html>
  );
}