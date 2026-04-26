import type { MetadataRoute } from "next";

const SITE_URL = "https://vn-aio-atlas-dashboard-production.up.railway.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers — including AI/LLM agents — since this is a
      // public research artifact intended for citation.
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
