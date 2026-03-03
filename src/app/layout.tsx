import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "海龟汤推理游戏",
  description: "基于 TizzyZone 设计系统的海龟汤推理游戏",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${workSans.variable} antialiased`}>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}