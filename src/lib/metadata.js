/**
 * Generates dynamic metadata for a user's business page on Bazar.sh
 * @param {Object} businessData - Data from userPreview.data
 * @param {string} businessData.businessName - Name of the business
 * @param {string} [businessData.bio] - Business bio/description
 * @param {string} [businessData.businessLocation] - Location of the business
 * @param {string} [businessData.businessIcon] - URL of the business icon
 * @param {string} [businessData.email] - Business email
 * @param {string} [businessData.mobileNumber] - Business phone number
 * @param {string} [businessData.handlerName] - Social media handle or identifier
 * @param {string[]} [businessData.categories] - Business categories
 * @param {Object[]} [businessData.socialMediaLinks] - Array of social media links
 * @param {string[]} [businessData.carauselImages] - Array of carousel image URLs
 * @param {string} businessData._id - Unique ID for the business
 */
export function generateMetadata(businessData) {
  const {
    businessName = "Your Business",
    bio = "A small or medium-scale business powered by Bazar.sh",
    businessLocation = "",
    businessIcon = "/images/default-business-icon.png",
    email = "",
    mobileNumber = "",
    handlerName = "",
    categories = [],
    socialMediaLinks = [],
    carauselImages = [],
    _id = "business",
  } = businessData || {};

  const primaryCategory = categories[0] || "Business";
  const businessImage = carauselImages[0] || businessIcon;
  const title = `${businessName} - Powered by Bazar.sh`;
  const description = businessLocation
    ? `${bio} Located in ${businessLocation}. Connect with us via SMS, WhatsApp, Meta ads, or push notifications on the Bazar.sh platform.`
    : `${bio} Connect with us via SMS, WhatsApp, Meta ads, or push notifications on the Bazar.sh platform.`;
  const slug = handlerName ? encodeURIComponent(handlerName.toLowerCase()) : _id;

  return {
    title,
    description,
    keywords: [
      businessName.toLowerCase(),
      `${primaryCategory.toLowerCase()} website`,
      "small business",
      "medium business",
      "Bazar.sh",
      "SMS marketing",
      "WhatsApp promotion",
      "Meta ads",
      "push notifications",
      ...(businessLocation ? [`${businessLocation.toLowerCase()} ${primaryCategory.toLowerCase()}`] : []),
      ...(categories.map((cat) => cat.toLowerCase())),
    ],
    alternates: {
      canonical: `https://bazar.sh/${slug}`,
      languages: {
        "en-US": `https://bazar.sh/en/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    viewport: "width=device-width, initial-scale=1",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
    ],
    openGraph: {
      title,
      description,
      url: `https://bazar.sh/${slug}`,
      siteName: "Bazar.sh",
      images: [
        {
          url: businessImage,
          width: 1200,
          height: 630,
          alt: `${businessName} on Bazar.sh`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@BazarSH", // Replace with actual Twitter handle
      images: [businessImage],
    },
    other: {
      "msapplication-TileImage": "/images/favicon.png", // Replace with actual favicon path
    },
  };
}

/**
 * Generates dynamic structured data (JSON-LD) for a user's business page
 * @param {Object} businessData - Data from userPreview.data
 */
export function generateStructuredData(businessData) {
  const {
    businessName = "Your Business",
    bio = "A small or medium-scale business powered by Bazar.sh",
    businessLocation = "",
    businessIcon = "/images/default-business-icon.png",
    email = "",
    mobileNumber = "",
    handlerName = "",
    categories = [],
    socialMediaLinks = [],
    carauselImages = [],
    _id = "business",
  } = businessData || {};

  const primaryCategory = categories[0] || "Business";
  const businessImage = carauselImages[0] || businessIcon;
  const slug = handlerName ? encodeURIComponent(handlerName.toLowerCase()) : _id;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    description: bio,
    url: `https://bazar.sh/${slug}`,
    image: businessImage,
    ...(primaryCategory && { additionalType: `https://schema.org/${primaryCategory}` }),
    ...(businessLocation && {
      address: {
        "@type": "PostalAddress",
        addressLocality: businessLocation,
      },
    }),
    ...(email && { email }),
    ...(mobileNumber && { telephone: mobileNumber }),
    sameAs: socialMediaLinks.map((link) => link.url).filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bazar.sh",
    url: "https://bazar.sh",
    description:
      "Bazar.sh is a business hub for small and medium enterprises to create professional websites and promote via SMS, WhatsApp, Meta ads, and push notifications.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bazar.sh/search?q={search_term_string}", // Replace with actual search URL
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Bazar.sh",
      logo: {
        "@type": "ImageObject",
        url: "/images/bazar-logo.png", // Replace with actual logo path
        width: 200,
        height: 60,
      },
    },
  };

  return [localBusinessSchema, websiteSchema];
}