import { Button } from "@/components/ui/button";
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";

const iconMap = {
  facebook: <Facebook className="mr-2 h-5 w-5" />,
  insta: <Instagram className="mr-2 h-5 w-5" />,
  linkedin: <Linkedin className="mr-2 h-5 w-5" />,
  x: <Twitter className="mr-2 h-5 w-5" />,
  youtube: <Youtube className="mr-2 h-5 w-5" />,
};

const Contact = ({ socialMediaLinks, email, location, mobileNumber }) => {
  const socialLinksArray = Object.entries(socialMediaLinks || {}).map(
    ([platformKey, url]) => ({
      platform: platformKey,
      url: url?.trim() || "#", // fallback to "#" if empty or null
    })
  );

  return (
    <section className="dark:text-white dark:bg-gray-800 w-[90%] mx-auto my-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
      <div>
        <h1 className="font-semibold text-4xl text-center mb-4">
          Let&apos;s Connect With Us
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {email && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Connect Through Email</h2>
            <Button variant="outline" className="w-full">
              <a
                href={`mailto:${email}`}
                className="text-neutral-600 dark:text-neutral-300"
              >
                Send Mail
              </a>
            </Button>
          </div>
        )}

        {mobileNumber && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Connect Through WhatsApp</h2>
            <Button variant="outline" className="w-full">
              <a
                href={`https://wa.me/${mobileNumber}`}
                className="text-neutral-600 dark:text-neutral-300"
              >
                Send WhatsApp Message
              </a>
            </Button>
          </div>
        )}

        {location && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <Button variant="outline" className="w-full">
              <a
                href={location || "#"}
                className="text-neutral-600 dark:text-neutral-300"
              >
                View Location
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Social Media Section */}
      {socialLinksArray.length > 0 && (
        <div className="p-4 bg-white dark:bg-gray-700 rounded shadow mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Connect on Social Media
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
            {socialLinksArray.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full flex items-center justify-start"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-neutral-600 dark:text-neutral-300 w-[70]"
                >
                  {iconMap[link.platform] || <Globe className="mr-2 h-5 w-5" />}
                  {link.platform.charAt(0).toUpperCase() +
                    link.platform.slice(1)}
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
