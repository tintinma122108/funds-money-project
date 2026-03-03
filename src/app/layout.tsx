import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";

// 避免构建时 SSG 执行依赖浏览器 location 的代码（如部分依赖库）
export const dynamic = "force-dynamic";

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