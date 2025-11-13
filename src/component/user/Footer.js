"use client";

import { Facebook, Instagram, Link2, Mail, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import FooterAd from "../addsence/FooterAd";

const Footer = ({ businessName }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed with email:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white px-4 sm:px-6 py-12 mt-16 text-sm">
      <FooterAd />
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <section className="lg:col-span-1">
            <div className="flex items-center mb-5">
              <Image 
                src="/favicon.png" 
                width={50} 
                height={50} 
                alt="Logo" 
                className="mr-3"
              />
              <h2 className="text-xl font-bold">{businessName}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              At <span className="font-semibold text-white">{businessName}</span>, we are committed to delivering quality products and reliable service—all in one place. Explore our curated collections and see why we are a trusted name on the Bazar.sh platform.
            </p>
            <address className="flex space-x-3 mt-5 not-italic">
              <Link 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </Link>
              <Link 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </Link>
              <Link 
                href="mailto:support@bazar.sh" 
                className="bg-gray-800 p-2 rounded-full hover:bg-red-500 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </Link>
              <Link 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-green-500 transition-colors"
                aria-label="Website"
              >
                <Link2 size={18} />
              </Link>
            </address>
          </section>

          {/* Quick Links */}
          <nav>
            <h3 className="text-lg font-semibold mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Home', 'Shop', 'About Us', 'Contact', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="flex items-center text-gray-300 hover:text-white transition-colors group"
                  >
                    <ChevronRight size={14} className="mr-1 group-hover:translate-x-1 transition-transform" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <section>
            <h3 className="text-lg font-semibold mb-5 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            {subscribed ? (
              <div className="bg-green-100 text-green-700 p-3 rounded-md text-center" aria-live="polite">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </section>
        </div>

        {/* Footer Bottom */}
        <section className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {businessName}.bazar.sh. All rights reserved.
          </p>
          <div className="flex items-center">
            <p className="text-gray-400 text-sm mr-2">Powered by</p>
            <a 
              href="https://bazar.sh" 
              className="text-blue-400 hover:text-blue-300 underline transition-colors flex items-center"
            >
              Bazar.sh
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
