import { Button } from "@/components/ui/button";
import PDFViewerWrapper from "@/components/user/product/pdf-reader-wrapper";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChevronLeftIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

interface ReadPageProps {
  params: { id: string };
}

export default async function ReadPage({ params }: ReadPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;
  const param = await params;
  const ebookId = param.id;

  const ownedEbook = await prisma.ownedEbook.findFirst({
    where: {
      userId,
      ebookId,
    },
    include: {
      ebook: true,
    },
  });

  if (!ownedEbook) {
    redirect("/my-library");
  }

  const ebook = ownedEbook.ebook;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-center items-center m-4 gap-2">
        <Link href="/dashboard/my-library">
          <Button size="icon">
            <ChevronLeftIcon />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{ebook.title}</h1>
      </div>


      <PDFViewerWrapper url={ebook.url} />
    </div>
  );
}
