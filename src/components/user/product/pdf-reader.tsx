"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
 import { useMediaQuery } from "react-responsive";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFReaderProps {
  url: string;
}

export default function PDFReader({ url }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>();
  

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTabletOrLaptop = useMediaQuery({ minWidth: 768 });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }


  const pageFitWidth = isMobile ? window.innerWidth - 40 : 800;
  
  return (
    <div className="flex justify-center w-full p-2 md:p-4">
      <Card className="flex flex-col w-full max-w-4xl p-2 md:p-4 min-w-sm">
        <ScrollArea className="flex-1 w-full h-[70vh]">
          <div className="flex justify-center w-full">
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="mb-4">
                  <Page
                    pageNumber={index + 1}
                    width={isTabletOrLaptop ? 800 : pageFitWidth}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </Document>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}