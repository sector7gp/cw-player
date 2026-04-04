import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CW Player Node",
  description: "Advanced web application for Morse Code learning and practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 lg:ml-64 overflow-y-auto w-full relative">
            <div className="max-w-6xl mx-auto p-8 relative z-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
