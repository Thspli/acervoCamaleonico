import type { Metadata } from "next";
import { MuseoModerno } from "next/font/google";
import "./globals.css";

const museoModerno = MuseoModerno({
  variable: "--font-museo",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Acervo Camaleônico",
  description: "Plataforma de fichas de RPG de mesa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={museoModerno.variable} style={{ fontFamily: "var(--font-museo), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}