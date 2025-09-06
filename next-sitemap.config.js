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
  exclude: ["/login"], // Keep only pages you truly want excluded from sitemap

  transform: async (config, path) => {
    const mainPages = [
      "/",
      "/offers",
      "/about-us",
      "/contact-us",
      "/categories",
    ];
    let lastmod = new Date().toISOString();

    try {
      const res = await fetch(
        `https://www.bazar.sh/api/lastmod?path=${encodeURIComponent(path)}`,
        {
          headers: { "Cache-Control": "no-cache" },
        }
      );
      const data = await res.json();
      lastmod = data.lastmod || lastmod;
    } catch (error) {
      console.warn(`Failed to fetch lastmod for ${path}: ${error.message}`);
    }

    return {
      loc: path,
      changefreq: mainPages.includes(path) ? "daily" : "weekly",
      priority: mainPages.includes(path) ? 1.0 : 0.7,
      lastmod,
    };
  },

  additionalPaths: async (config) => {
    try {
      const res = await fetch("https://www.bazar.sh/api/user/sco");
      const data = await res.json();

      const userPaths = (data.users || [])
        .filter((u) => u.slug && u.isActive !== false)
        .map((u) => `/${encodeURIComponent(u.slug)}`);

      const transformedUserPaths = await Promise.all(
        userPaths.map((path) => config.transform(config, path))
      );

      const fixedPaths = [
        "/",
        "/offers",
        "/about-us",
        "/contact-us",
        "/categories",
      ];
      const transformedFixedPaths = await Promise.all(
        fixedPaths.map((path) => config.transform(config, path))
      );

      return [...transformedFixedPaths, ...transformedUserPaths];
    } catch (error) {
      console.error(`Error fetching additional paths: ${error.message}`);
      return [await config.transform(config, "/")];
    }
  },
};
