const axios = require("axios");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.bazar.sh",
  generateRobotsTxt: true,
  sitemapSize: 500,

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },

  exclude: ["/login"], // pages to exclude

  transform: async (config, path) => {
    const mainPages = ["/", "/offers", "/about-us", "/contact-us", "/categories"];

    return {
      loc: path,
      changefreq: mainPages.includes(path) ? "daily" : "weekly",
      priority: mainPages.includes(path) ? 1.0 : 0.8,
    };
  },

  additionalPaths: async (config) => {
    try {
      const res = await axios.get("https://www.bazar.sh/api/user/sco");
      const data = res.data;

      const userPaths = (data.users || [])
        .filter((u) => u.slug && u.isActive !== false)
        .map((u) => `/${encodeURIComponent(u.slug)}`);

      return await Promise.all(userPaths.map((path) => config.transform(config, path)));
    } catch (error) {
      console.warn(`Skipping additional paths: ${error.message}`);
      
      return [];
    }
  },
};
