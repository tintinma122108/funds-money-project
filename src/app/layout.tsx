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
  title: "基金估值助手",
  description: "实时基金持仓估值，FUND YOUR FORTUNE",
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