import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ShareButton from "@/components/user/product/components/share-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookAIcon, ShoppingBasketIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function MyLibraryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const ownedEbooks = await prisma.ownedEbook.findMany({
    where: { userId },
    include: {
      ebook: true,
    },
    orderBy: {
      purchasedAt: "desc",
    },
  });

  const sharedEbooks = await prisma.sharedEbook.findMany({
    where: { toUserId: userId },
    include: {
      ebook: true,
    },
    orderBy: {
      sharedAt: "desc",
    },
  });

  if (ownedEbooks.length === 0 && sharedEbooks.length === 0) {
    return (
      <div className="p-2">
        <div className="h-screen w-full border-2 border-dashed border-border rounded-lg flex justify-center items-center">
          <Card className="p-2">
            <h1 className="text-2xl font-bold">Sorry!</h1>
            <p className="m-1">You haven&apos;t purchased or received any books yet.</p>
            <Link href="/dashboard">
              <Button className="w-full">
                <ShoppingBasketIcon /> Start Buying
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold m-3">My Library</h1>
      <Separator />
      {ownedEbooks.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-3">
            {ownedEbooks.map((owned) => {
              const ebook = owned.ebook;
              return (
                <Card key={ebook.id} className="w-full">
                  <CardHeader>
                    <div className="w-full">
                      <div className="relative overflow-hidden">
                        <AspectRatio
                          ratio={16 / 19}
                          className="overflow-hidden rounded-lg"
                        >
                          <Image
                            src={ebook.coverImage}
                            alt={ebook.title}
                            fill
                            priority
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            unoptimized
                          />
                        </AspectRatio>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-2">{ebook.title}</CardTitle>
                    <Badge>{ebook.author}</Badge>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-3 m-1">
                      {ebook.description}
                    </CardDescription>
                    <Badge className="mb-2 mt-2">Remaining E-Books : {owned.quantity}</Badge>
                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/my-library/read/${ebook.id}`}>
                       <BookAIcon /> Read Book
                      </Link>
                    </Button>
                    {owned.available > 1 && <ShareButton ebookId={ebook.id} />}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
      {sharedEbooks.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-3">
            {sharedEbooks.map(({ ebook }) => (
              <Card key={ebook.id} className="w-full">
                <CardHeader>
                  <div className="w-full">
                    <div className="relative overflow-hidden">
                      <AspectRatio
                        ratio={16 / 19}
                        className="overflow-hidden rounded-lg"
                      >
                        <Image
                          src={ebook.coverImage}
                          alt={ebook.title}
                          fill
                          priority
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          unoptimized
                        />
                      </AspectRatio>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{ebook.title}</CardTitle>
                  <Badge variant="secondary" className="mr-2">Shared</Badge>
                  <Badge>{ebook.author}</Badge>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-3 m-1">
                    {ebook.description}
                  </CardDescription>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/my-library/read/${ebook.id}`}>
                     <BookAIcon /> Read Book
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}