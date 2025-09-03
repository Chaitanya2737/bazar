/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.bazar.sh",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/user/*", "/admin/*", "/api/*", "/dashboard/*", "/login"],
      },
    ],
  },

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
    const isMainOrFixedPage = ['/', '/offers', '/about-us', '/contact-us', '/categories' ].includes(path);
    let lastmod = new Date().toISOString();

    // Fetch dynamic lastmod if available (e.g., from CMS or API)
    try {
      if (path.startsWith('/')) {
        const res = await fetch(`https://www.bazar.sh/api/lastmod?path=${encodeURIComponent(path)}`, {
          headers: { 'Cache-Control': 'no-cache' }, // Prevent caching issues
        });
        const data = await res.json();
        lastmod = data.lastmod || lastmod;
      }
    } catch (error) {
      console.warn(`Failed to fetch lastmod for ${path}: ${error.message}`);
      // Fallback to current timestamp
    }

    return {
      mobile: true, // Ensure mobile compatibility
      loc: path,
      changefreq: isMainOrFixedPage ? "daily" : "weekly", // Adjust frequency based on page type
      priority: isMainOrFixedPage ? 1.0 : 0.8, // Slightly higher default priority
      lastmod: lastmod,
    };
  },

  additionalPaths: async (config) => {
    try {
      // Fetch dynamic slugs from your API with caching headers
      const res = await fetch("https://www.bazar.sh/api/user/sco", {
      });
      const data = await res.json();

      console.log(data);

      // Filter active users with slugs
      const usersWithSlug = (data.users || []).filter((u) => u.slug && u.isActive !== false);
      const userPaths = await Promise.all(
        usersWithSlug.map((user) =>
          config.transform(config, `/${encodeURIComponent(user.slug)}`)
        )
      );

      // Define static routes
      const fixedPaths = [
        await config.transform(config, "/"),
        await config.transform(config, "/offers"),
        await config.transform(config, "/about-us"),
        await config.transform(config, "/contact-us"),
        await config.transform(config, "/categories"),
      ];

      return [...fixedPaths, ...userPaths];
    } catch (error) {
      console.error(`Error fetching additional paths: ${error.message}`);
      return [await config.transform(config, "/")]; // Fallback to homepage
    }
  },
};