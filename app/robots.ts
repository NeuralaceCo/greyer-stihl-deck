import type { MetadataRoute } from "next";

/* A private proposal: no crawlers. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
