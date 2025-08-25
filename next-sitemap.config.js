/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.bazar.sh",
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // Exclude internal/admin routes from sitemap
  exclude: [
   
    "/user/*",
    "/offers/*",
    "/admin/*",
    "/api/*",
    "/dashboard/*",
    "/login",
  ],

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (config) => {
    // Fetch dynamic slugs from your API
    const res = await fetch("https://www.bazar.sh/api/user/sco");
    const data = await res.json();

    // Only keep users with slug
    const usersWithSlug = (data.users || []).filter((u) => u.slug);

    // Map slugs to proper encoded URLs
    const userPaths = await Promise.all(
      usersWithSlug.map((user) =>
        config.transform(config, `/${encodeURIComponent(user.slug)}`)
      )
    );

    // Add custom static routes manually
    return [
      await config.transform(config, "/offers"),
      await config.transform(config, "/about-us"),
      ...userPaths,
    ];
  },
};
