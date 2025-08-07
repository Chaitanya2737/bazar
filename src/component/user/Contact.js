import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const iconMap = {
  facebook: <Facebook className="mr-2 h-5 w-5" />,
  insta: <Instagram className="mr-2 h-5 w-5" />,
  linkedin: <Linkedin className="mr-2 h-5 w-5" />,
  x: <Twitter className="mr-2 h-5 w-5" />,
  youtube: <Youtube className="mr-2 h-5 w-5" />,
};

const Contact = ({ socialMediaLinks, email, location, mobileNumber }) => {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinksArray = Object.entries(socialMediaLinks || {}).map(
    ([platformKey, url]) => ({
      platform: platformKey,
      url: url?.trim() || "#",
    })
  );

  return (
    <section className="dark:text-white w-[90%] mx-auto my-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg transition-colors duration-300">
      <div>
        <h1 className="font-semibold text-4xl text-center mb-6">
          Let&apos;s Connect With Us
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {email && (
          <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow transition-transform duration-300 hover:scale-[1.02]">
            <h2 className="text-xl font-semibold mb-3">
              Connect Through Email
            </h2>
            <Button
              variant="outline"
              className="w-full hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              <a
                href={`mailto:${email}`}
                className="w-full text-center text-neutral-700 dark:text-neutral-200"
                aria-label="Send email"
              >
                Send Mail
              </a>
            </Button>
          </div>
        )}

        {Array.isArray(mobileNumber) && mobileNumber.length > 0 && (
          <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow transition-transform duration-300 hover:scale-[1.02]">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Connect Through WhatsApp
            </h2>

            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full hover:bg-green-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  Send WhatsApp Message
                </Button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-lg">Choose a Number</DrawerTitle>
                </DrawerHeader>

                <div className="px-4 pb-4 space-y-2">
                  {mobileNumber.map((number, index) => (
                    <a
                      key={index}
                      href={`https://wa.me/${number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 text-center rounded-md bg-green-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-green-200 dark:hover:bg-gray-700 transition"
                    >
                      {number}
                    </a>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}

        {location && (
          <div className="bg-white dark:bg-gray-700 p-5 rounded-lg shadow transition-transform duration-300 hover:scale-[1.02]">
            <h2 className="text-xl font-semibold mb-3">Location</h2>
            <Button
              variant="outline"
              className="w-full hover:bg-gray-200 dark:hover:bg-slate-800 transition"
            >
              <a
                href={location}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center text-neutral-700 dark:text-neutral-200"
                aria-label="View location"
              >
                View Location
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Social Media Section */}
      {socialLinksArray.length > 0 && (
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Connect on Social Media
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {socialLinksArray.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto flex items-center justify-start hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center text-neutral-700 dark:text-neutral-200 w-full h-full"
                  aria-label={`Visit ${link.platform}`}
                >
                  {iconMap[link.platform] || <Globe className="h-6 w-6" />}
                </a>
              </Button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
