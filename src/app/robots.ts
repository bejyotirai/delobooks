import { Site } from '@/config/site/site'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return (
        Site.robots
    )
}