import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Elle ou Lui ? | Soumaya & Florent",
  description: "Jeu des invités pour le mariage de Soumaya et Florent",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e8a598",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${nunito.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="h-full min-h-full wedding-bg text-(--ink)">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
