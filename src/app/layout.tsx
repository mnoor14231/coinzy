import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "🪙 كوينزي - الكورس المالي للأطفال (٤-٩ سنوات)",
  description: "تطبيق تفاعلي لتعليم الأطفال المهارات المالية بطريقة ممتعة وآمنة - ادخار، تخطيط، وتحديد الأولويات",
  keywords: "تعليم مالي, أطفال, ادخار, تخطيط مالي, تطبيق تفاعلي, كورس مالي, مهارات مالية",
  authors: [{ name: "Coinzy Team" }],
  robots: "index, follow",
  themeColor: "#667eea",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body
        className={`${notoKufiArabic.variable} font-arabic antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Main App Container */}
        <div className="min-h-screen w-full flex justify-center items-start">
          <div className="w-full max-w-md mx-auto relative bg-white/95 backdrop-blur-sm shadow-2xl border-x-2 border-white/20 min-h-screen">
            {/* Content */}
            <main className="relative z-10">
              {children}
            </main>
            
            {/* Background decorative elements */}
            <div className="fixed top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse" />
            <div className="fixed top-32 right-10 w-16 h-16 bg-pink-300/20 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="fixed bottom-32 left-5 w-12 h-12 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-2000" />
            <div className="fixed bottom-20 right-8 w-14 h-14 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-500" />
          </div>
        </div>
        
        {/* Global loading overlay (if needed) */}
        <div id="loading-overlay" className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-500">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-bounce">🪙</div>
            <div className="text-xl font-bold">جاري التحميل<span className="loading-dots"></span></div>
          </div>
        </div>
      </body>
    </html>
  );
}
