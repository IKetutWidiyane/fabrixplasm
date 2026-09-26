import type { MetadataRoute } from "next";

// Update BASE_URL to the real production domain before going live.
const BASE_URL = "https://fabrixplasm.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}