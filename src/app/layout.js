import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "BUMI | Jasa Forwarder Nasional",
  description: "Modern & Secure Freight Forwarder Management",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-surface-950 text-surface-50">
        {children}
      </body>
    </html>
  );
}
