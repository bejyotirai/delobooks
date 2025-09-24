"use client";

import CreateEbook from "@/components/admin/product/create/e-book";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Globe, Trash } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const formRef = useRef<{ submit: () => void; isLoading: boolean }>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(formRef.current?.isLoading || false);
    }, 100); 
    return () => clearInterval(interval);
  }, []);

  const handlePublish = () => {
    if (!isLoading) {
      formRef.current?.submit();
    }
  };

  const handleDiscard = () => {
    if (!isLoading) {
      router.push("/admin/e-books");
    }
  };

  return (
    <div className="bg-muted w-full h-full">
      <div className="flex items-center gap-2">
        <Button size="icon" className="h-7 w-7 m-3" onClick={handleDiscard} disabled={isLoading}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Add new e-book
        </h3>
        <div className="hidden items-center gap-2 md:ml-auto md:flex m-3">
          <Button variant="destructive" size="sm" onClick={handleDiscard} disabled={isLoading}>
            <Trash className="size-4 me-1" />
            Discard
          </Button>
          <Button size="sm" onClick={handlePublish} disabled={isLoading}>
            <Globe className="size-4 me-1" />
            Publish
          </Button>
        </div>
      </div>
      <div className="m-4 ">
        <CreateEbook ref={formRef} />
      </div>
      <div className="flex items-center justify-between gap-2 m-4 md:hidden">
        <Button variant="destructive" size="sm" onClick={handleDiscard} disabled={isLoading}>
          <Trash className="size-4 me-1" />
          Discard
        </Button>
        <Button size="sm" onClick={handlePublish} disabled={isLoading}>
          <Globe className="size-4 me-1" />
          Publish
        </Button>
      </div>
    </div>
  );
}

export default Page;