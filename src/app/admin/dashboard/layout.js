import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head"; // Import Next.js Head for metadata management
import UserNav from "@/component/user/UserPanel/UserNav";
import AdminCompNav from "@/component/admin/AdminCompNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "admin meta data",
  description: "admin personal data",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="google-site-verification" content="qdEF9AwQZuLr3H3bWxnk8hjpXsgPiOKm5ujetKR0x3k" />
      </Head>

      <UserNav />
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bottom-1.5  z-50`}
      >
        {children}
        <nav className="sticky bottom-0 shadow-md z-50 ">
        <AdminCompNav />
        </nav>
      </div> 
    </>
  );
}
