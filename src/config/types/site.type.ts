import type { Metadata, Viewport, MetadataRoute } from "next";

export type SiteAuthor = {
  name: string;
  email?: string;
  url?: string;
};

export type SiteSEO = {
  title: string;
  description: string;
  url: string;
  siteName: string;
  keywords: string | string[];
  authors: NonNullable<Metadata["authors"]>;
  creator: string;
};

export type SiteSitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export type SiteRobotRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
};

export type SiteRobots = {
  rules: SiteRobotRule[];
  sitemap?: string;
};

export interface ManifestIcon {
  src: string
  sizes?: string
  type?: string
  purpose?: 'maskable' | 'any' | 'monochrome'
}

export type SiteType = {

  title: NonNullable<Metadata["title"]>;
  description: string;
  url: string;

  seo: SiteSEO;

  metadata: Metadata;

  viewport: Viewport;

  author: SiteAuthor;

  manifest: MetadataRoute.Manifest;

  sitemap: SiteSitemapEntry[];

  robots: SiteRobots;
};
