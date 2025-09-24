
'use client';

import dynamic from 'next/dynamic';


const PDFReader = dynamic(() => import('./pdf-reader'), {
  ssr: false,
});

interface PDFViewerWrapperProps {
  url: string;
}

export default function PDFViewerWrapper({ url }: PDFViewerWrapperProps) {
  return <PDFReader url={url} />;
}