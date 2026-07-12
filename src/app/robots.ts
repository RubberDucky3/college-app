import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/chat", "/onboard", "/api/"],
    },
    sitemap: "https://college-app-delta.vercel.app/sitemap.xml",
  };
}
