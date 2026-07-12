import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StudentGraphProvider } from "@/contexts/StudentGraph";
import CompareBar from "@/components/CompareBar";
import AIMentor from "@/components/AIMentor";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: {
    default: "CollegeHub — Compare 2,600+ Colleges by Tuition, Acceptance Rate & Aid",
    template: "%s — CollegeHub",
  },
  description:
    "Find and compare every US college. Search by tuition, acceptance rate, SAT scores, financial aid, and programs. Free college planning tools, net price calculator, and college match quiz.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://college-app-delta.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "CollegeHub",
    title: "CollegeHub — Compare 2,600+ Colleges by Tuition, Acceptance Rate & Aid",
    description:
      "Find and compare every US college. Search by tuition, acceptance rate, SAT scores, financial aid, and programs.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeHub — Compare 2,600+ Colleges",
    description:
      "Find and compare every US college by tuition, acceptance rate, SAT scores, and financial aid.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#2563eb",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "CollegeHub",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6833582243561020" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6833582243561020"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <StudentGraphProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AIMentor />
          <CompareBar />
          <PwaInstallPrompt />
          <ServiceWorkerRegistration />
          <BackToTop />
        </StudentGraphProvider>
      </body>
    </html>
  );
}
