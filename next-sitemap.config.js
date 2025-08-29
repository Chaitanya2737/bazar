/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.bazar.sh",
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // Exclude internal/admin routes from sitemap
  exclude: [
    "/user/*",
    "/offers/*", // Exclude sub-routes of /offers, keep /offers root
    "/admin/*",
    "/api/*",
    "/dashboard/*",
    "/login",
  ],

  transform: async (config, path) => {
    const isMainOrFixedPage = ['/', '/offers', '/about-us'].includes(path);
    return {
      loc: path,
      changefreq: isMainOrFixedPage ? "daily" : "weekly", // More frequent updates for key pages
      priority: isMainOrFixedPage ? 1.0 : 0.7, // Higher priority for main and fixed pages
      lastmod: new Date().toISOString(), // Replace with dynamic lastmod if available
    };
  },

  additionalPaths: async (config) => {
    // Fetch dynamic slugs from your API
    const res = await fetch("https://www.bazar.sh/api/user/sco");
    const data = await res.json();

    // Only keep users with slug and active status
    const usersWithSlug = (data.users || []).filter((u) => u.slug && u.isActive !== false);

    // Map slugs to proper encoded URLs
    const userPaths = await Promise.all(
      usersWithSlug.map((user) =>
        config.transform(config, `/${encodeURIComponent(user.slug)}`)
      )
    );

    // Add custom static routes manually, ensuring they are under main site branding
    const fixedPaths = [
      await config.transform(config, "/offers"),
      await config.transform(config, "/about-us"),
      await config.transform(config, "/contact-us"), // Add other fixed pages as needed
      await config.transform(config, "/categories"), // Example for category overview
    ];

    return [
      await config.transform(config, "/"), // Ensure homepage is included
      ...fixedPaths,
      ...userPaths,
    ];
  },
};