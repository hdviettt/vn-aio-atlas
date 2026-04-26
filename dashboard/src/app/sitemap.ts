import type { MetadataRoute } from "next";

const SITE_URL = "https://vn-aio-atlas-dashboard-production.up.railway.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${SITE_URL}/?lang=en`,
          vi: `${SITE_URL}/?lang=vi`,
        },
      },
    },
    {
      url: `${SITE_URL}/?lang=vi`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
