import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import UserCompNav from "@/component/user/userCompNav";
import Head from "next/head"; // Import Next.js Head for metadata management
import UserNav from "@/component/user/UserPanel/UserNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "user meta data",
  description: "user personal data",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />  {/* ⭐️ Add this */}
      </Head>

      <UserNav />
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bottom-1.5 z-50`}
      >
        {children}
        <nav className="sticky bottom-0 shadow-md z-50 ">
          <UserCompNav />
        </nav>
      </div>
    </>
  );
}

