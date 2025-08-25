/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.bazar.sh",
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // Manually include specific routes (like offers, about-us, etc.)
  additionalPaths: async (config) => [
    await config.transform(config, "/offers"),
    await config.transform(config, "/about-us"),
  ],
};
