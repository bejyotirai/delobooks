import { Site } from '@/config/site/site'
import { ManifestIcon } from '@/config/types/site.type'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    ...Site.manifest,
    display: Site.manifest.display as 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser' | undefined,
    icons: Site.manifest.icons?.map((icon: ManifestIcon) => ({
      ...icon,
      purpose: icon.purpose as 'maskable' | 'any' | 'monochrome' | undefined,
    })),
  }
}