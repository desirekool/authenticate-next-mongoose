import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./ui/Header";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import SessionProvider from "@/app/utils/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="mx-auto gap-2 mb-10 flex flex-col items-center">
            <Header />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
