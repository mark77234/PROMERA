import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "PROMERA — 실기형 AI 활용능력 진단·훈련 코치",
  description:
    "직접 쓴 프롬프트를 5개 기준으로 진단하고, 코칭 질문으로 개선하며 AI 활용능력을 키우는 실기형 훈련 코치",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
