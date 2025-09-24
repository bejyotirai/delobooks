"use client";

import UpdateEbook from "@/components/admin/product/update/e-book";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Globe, Trash } from "lucide-react";
import { useRef, useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteEbook, getEbook } from "@/components/admin/product/update/action";

interface Ebook {
  id: string;
  title: string;
  description: string;
  slug: string;
  author: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  pages: number;
  coverImage: string;
  url: string;
  images: string[];
  format: string[];
  category: string;
}

function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const formRef = useRef<{ submit: () => void; isLoading: boolean }>(null);
  const router = useRouter();
  const { slug } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [ebook, setEbook] = useState<Ebook | null>(null); 
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    async function fetchEbook() {
      try {
        const data = await getEbook(slug);
        if (!data) {
          toast.error("E-book not found");
          router.push("/admin/e-books");
          return;
        }
        setEbook(data);
      } catch (error: unknown) {
        console.error("Error fetching ebook:", error instanceof Error ? error.message : 'Unknown error');
        toast.error("Failed to load e-book");
        router.push("/admin/e-books");
      } finally {
        setFetchLoading(false);
      }
    }
    fetchEbook();
  }, [slug, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(formRef.current?.isLoading || false);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    if (!isLoading) {
      formRef.current?.submit();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      router.push("/admin/e-books");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this e-book? This action cannot be undone.")) {
      try {
        await deleteEbook(slug);
        toast.success("E-book deleted successfully");
        router.push("/admin/e-books");
      } catch (error: unknown) {
        console.error("Error deleting ebook:", error instanceof Error ? error.message : 'Unknown error');
        toast.error("Failed to delete e-book");
      }
    }
  };

  if (fetchLoading) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  if (!ebook) {
    return <div className="h-full flex items-center justify-center">E-book not found</div>;
  }

  return (
    <main className="h-full bg-muted w-full">
      <div className="flex items-center gap-2 m-2">
        <Button size="icon" className="h-7 w-7" disabled={isLoading} onClick={handleCancel}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Update e-book
        </h3>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
            <Trash className="size-4 me-1" />
            Delete
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            <Globe className="size-4 me-1" />
            Save
          </Button>
        </div>
      </div>
      <div className="m-4 bg-muted">
        <UpdateEbook ref={formRef} ebook={ebook} />
      </div>
      <div className="flex items-center justify-between gap-2 m-4 md:hidden">
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
          <Trash className="size-4 me-1" />
          Delete
        </Button>
        <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isLoading}>
          <Globe className="size-4 me-1" />
            Save
        </Button>
      </div>
    </main>
  );
}

export default Page;