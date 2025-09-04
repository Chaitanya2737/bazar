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
        disallow: ["/user/*", "/admin/*", "/api/*", "/dashboard/*"], 
      },
    ],
  },

  // Only exclude internal/admin routes
  exclude: [
    "/user/*",
    "/admin/*",
    "/api/*",
    "/dashboard/*",
    "/login",
  ],

  transform: async (config, path) => {
    const isMainOrFixedPage = ["/", "/offers", "/about-us", "/contact-us", "/categories"].includes(path);
    let lastmod = new Date().toISOString();

    // Optional: You can remove this API fetch if unstable
    try {
      const res = await fetch(`https://www.bazar.sh/api/lastmod?path=${encodeURIComponent(path)}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      lastmod = data.lastmod || lastmod;
    } catch (error) {
      console.warn(`Failed to fetch lastmod for ${path}: ${error.message}`);
    }

    return {
      loc: path,
      changefreq: isMainOrFixedPage ? "daily" : "weekly",
      priority: isMainOrFixedPage ? 1.0 : 0.7, // Lower priority for less important pages
      lastmod,
    };
  },

  additionalPaths: async (config) => {
    try {
      // Fetch dynamic user slugs
      const res = await fetch("https://www.bazar.sh/api/user/sco");
      const data = await res.json();

      const usersWithSlug = (data.users || []).filter(
        (u) => u.slug && u.isActive !== false
      );

      const userPaths = await Promise.all(
        usersWithSlug.map((user) =>
          config.transform(config, `/${encodeURIComponent(user.slug)}`)
        )
      );

      // Add static important pages
      const fixedPaths = await Promise.all(
        ["/", "/offers", "/about-us", "/contact-us", "/categories"].map((p) =>
          config.transform(config, p)
        )
      );

      return [...fixedPaths, ...userPaths];
    } catch (error) {
      console.error(`Error fetching additional paths: ${error.message}`);
      return [await config.transform(config, "/")];
    }
  },
};
