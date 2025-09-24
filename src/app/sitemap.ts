import { Site } from '@/config/site/site'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return (
    Site.sitemap.map((item) => ({
      url: item.url,
      lastModified: item.lastModified,
      changeFrequency: item.changeFrequency as
        | "yearly"
        | "monthly"
        | "weekly"
        | "always"
        | "hourly"
        | "daily"
        | "never"
        | undefined,
      priority: item.priority,
    }))
  )

}