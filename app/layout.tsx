import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/stylesheets/main.scss";
import ReduxProvider from "./ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biometric Attendance System",
  description: "Fingerprint based attendance system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="./images/F-B-A-S.png" sizes="any" />
      <ReduxProvider>
        <body className={inter.className}>{children}</body>
      </ReduxProvider>
    </html>
  );
}
