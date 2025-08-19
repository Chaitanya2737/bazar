import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaWhatsapp, FaLocationDot } from "react-icons/fa6";
import { motion } from "framer-motion";

const iconMap = [
  {
    icon: <Facebook className="h-5 w-5 text-white" />,
    bg: "bg-gradient-to-r from-blue-600 to-blue-800",
    key: "facebook",
  },
  {
    icon: <Instagram className="h-5 w-5 text-white" />,
    bg: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    key: "insta",
  },
  {
    icon: <Linkedin className="h-5 w-5 text-white" />,
    bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
    key: "linkedin",
  },
  {
    icon: <Twitter className="h-5 w-5 text-white" />,
    bg: "bg-gradient-to-r from-gray-700 to-black",
    key: "x",
  },
  {
    icon: <Youtube className="h-5 w-5 text-white" />,
    bg: "bg-gradient-to-r from-red-500 to-red-700",
    key: "youtube",
  },
];

const Contact = ({ socialMediaLinks, email, location, mobileNumber }) => {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinksArray = Object.entries(socialMediaLinks || {}).map(
    ([platformKey, url]) => ({
      platform: platformKey.toLowerCase(),
      url: url?.trim() || "#",
    })
  );

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

  return (
    <section className="dark:text-white w-full max-w-5xl mx-auto my-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl transition-all duration-500">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-bold text-4xl md:text-5xl text-center mb-8 text-black dark:text-white">
        Stay Connected
        </h1>
      </motion.div>

      {/* Contact Buttons */}
      <motion.div
        className="grid grid-cols-3 gap-6 justify-items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {email && (
          <motion.div variants={buttonVariants}>
            <Button
              asChild
              variant="outline"
              className="h-15 w-15 flex items-center justify-center rounded-full shadow-md 
                hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 
                transition-all duration-300 border-2 border-blue-200 dark:border-blue-700"
            >
              <a href={`mailto:${email}`} aria-label="Send email">
                <Mail className="h-9 w-9 text-blue-600 dark:text-blue-400" />
              </a>
            </Button>
          </motion.div>
        )}

        {Array.isArray(mobileNumber) && mobileNumber.length > 0 && (
          <motion.div variants={buttonVariants}>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="h-15 w-15 flex items-center justify-center rounded-full shadow-md 
                    hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-110 
                    transition-all duration-300 border-2 border-green-200 dark:border-green-700"
                >
                  <FaWhatsapp className="h-9 w-9 text-green-600 dark:text-green-400" />
                </Button>
              </DrawerTrigger>

              <DrawerContent className="bg-white dark:bg-gray-800">
                <DrawerHeader>
                  <DrawerTitle className="text-xl font-semibold text-center">
                    Contact via WhatsApp
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-6 pb-6 space-y-3 max-h-60 overflow-y-auto">
                  {mobileNumber.map((number, index) => (
                    <motion.a
                      key={index}
                      href={`https://wa.me/${number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 text-center rounded-lg 
                        bg-green-50 dark:bg-green-900/20 
                        text-green-800 dark:text-green-200 
                        hover:bg-green-100 dark:hover:bg-green-800/30 
                        transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {number}
                    </motion.a>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </motion.div>
        )}

        {location && (
          <motion.div variants={buttonVariants}>
            <Button
              asChild
              variant="outline"
              className="h-15 w-15 flex items-center justify-center rounded-full shadow-md 
                hover:bg-gray-100 dark:hover:bg-gray-700/30 hover:scale-110 
                transition-all duration-300 border-2 border-gray-200 dark:border-gray-600"
            >
              <a
                href={location}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View location"
              >
                <FaLocationDot className="h-9 w-9 text-gray-600 dark:text-gray-300" />
              </a>
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Social Media Section */}
      <motion.div
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <motion.div
          className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-8 justify-items-center"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {socialLinksArray.map((link, index) => {
            const matchedIcon = iconMap.find(
              (item) => item.key === link.platform
            );

            // ⛔ Skip platforms without icons (no default fallback)
            if (!matchedIcon) return null;

            return (
              <motion.div key={index} variants={buttonVariants}>
                <Button
                  asChild
                  className={`h-12 w-12 flex items-center justify-center rounded-full shadow-lg 
                    transition-all duration-300 ${matchedIcon.bg}`}
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${link.platform}`}
                  >
                    {matchedIcon.icon}
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
