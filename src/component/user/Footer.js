"use client";

import { Facebook, Instagram, Link2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = ({ businessName }) => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10 mt-10 text-sm">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Info & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Logo & Description */}
          <div>
            {/* <Image src="/logo.png" width={120} height={120} alt="Logo" className="mb-4" /> */}
            <h1 className="text-xl font-bold mb-2">Place Logo Here</h1>
            <p className="text-gray-300 leading-relaxed">
              At <span className="font-semibold">{businessName}</span>, we’re committed to delivering quality products and reliable service— all in one place. Explore our curated collections and see why we’re a trusted name on the Bazar.sh platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">Connect with us</h3>
          <ul className="flex gap-6">
            <li>
              <Link href="#" className="hover:text-pink-400" aria-label="Instagram">
                <Instagram size={22} />
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-500" aria-label="Facebook">
                <Facebook size={22} />
              </Link>
            </li>
            <li>
              <Link href="mailto:support@bazar.sh" className="hover:text-yellow-300" aria-label="Email">
                <Mail size={22} />
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-green-400" aria-label="Website">
                <Link2 size={22} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer Bottom */}
        <div className="text-center border-t border-gray-700 pt-4 text-gray-400 text-xs">
          <p>&copy; {new Date().getFullYear()} {businessName}.bazar.sh. All rights reserved.</p>
          <p>
            Powered by{" "}
            <a href="https://bazar.sh" className="underline hover:text-blue-400">Bazar.sh</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
