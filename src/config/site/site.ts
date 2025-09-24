
import { SiteType } from "../types/site.type";
import type { Metadata, Viewport } from "next";
import type { MetadataRoute } from "next";

const siteUrl = String(process.env.NEXT_PUBLIC_API_URL!);

const manifest: MetadataRoute.Manifest = {
    name: 'Delobooks',
    short_name: 'Delobooks',
    description: 'Delobooks is an ebook selling platform which helps millions of students across the globe for e learning.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#ffffff',
    orientation: "portrait",
    icons: [
        {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
        },
        {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
        },
    ],
    screenshots: [
        {
            src: "/home-narrow.webp",
            type: "image/webp",
            sizes: "540x720",
            form_factor: "narrow"
        },
        {
            src: "/home-wide.jpg",
            type: "image/jpg",
            sizes: "1200x800",
            form_factor: "wide"
        }
    ]
};

const metadata: Metadata = {
    title: {
        template: '%s | Delobooks',
        default: 'Delobooks',
    },
    description:
        'Delobooks is an ebook selling platform which helps millions of students across the globe for e learning.',
    metadataBase: new URL(siteUrl),
    keywords: ['web development', 'html', 'css', 'javascript', 'react', 'nextjs', 'typescript'],
    authors: [{ name: 'Jyoti', url: 'https://delobooks.vercel.app/' }],
    creator: 'Jyoti',
    manifest: `${siteUrl}/manifest.webmanifest`,
    icons: {
        icon: `${siteUrl}/favicon.ico`,
        apple: `${siteUrl}/apple-icon.png`,
        shortcut: `${siteUrl}/favicon-16x16.png`,
        other: [
            {
                rel: "mask-icon",
                url: `${siteUrl}/icon0.svg`,
                color: manifest.theme_color,
            },
        ],
    },
    openGraph: {
        title: 'Delobooks',
        description:
            'Delobooks is an ebook selling platform which helps millions of students across the globe for e learning.',
        url: siteUrl,
        siteName: 'Delobooks',
        images: [
            {
                url: `${siteUrl}/og.png`,
                width: 1200,
                height: 630,
                alt: 'Delobooks',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
};

const viewport: Viewport = {
    themeColor: manifest.theme_color,
};

export const Site: SiteType = {
    title: metadata.title!,
    description: metadata.description!,
    url: siteUrl,
    seo: {
        title: typeof metadata.openGraph?.title === 'string' ? metadata.openGraph.title : 'Delobooks',
        description: metadata.openGraph?.description ?? 'Delobooks is an ebook selling platform which helps millions of students across the globe for e learning.',
        url: typeof metadata.openGraph?.url === "string"
            ? metadata.openGraph.url
            : metadata.openGraph?.url instanceof URL
                ? metadata.openGraph.url.toString()
                : siteUrl,
        siteName: metadata.openGraph?.siteName ?? 'Delobooks',
        keywords: Array.isArray(metadata.keywords)
            ? metadata.keywords
            : [metadata.keywords ?? 'ebook'],
        authors: metadata.authors!,
        creator: metadata.creator!,
    },
    author: {
        name: 'Jyoti',
        email: 'jrai16674@gmail.com',
        url: 'https://delobooks.vercel.app/',
    },
    sitemap: [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${siteUrl}/home`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ],
    robots: {
        rules: [
            {
                userAgent: 'Googlebot',
                allow: ['/'],
                disallow: '/admin/',
            },
            {
                userAgent: ['Applebot', 'Bingbot'],
                disallow: ['/admin/'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    },
    manifest,
    metadata,
    viewport,
};
