import { ReturnButton } from "@/components/auth/components/return-button";
import { Card, CardContent } from "@/components/ui/card";
import { SquareLibrary } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const error = (await searchParams).error;

  return (
    <main className="min-h-screen w-full">
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
            prefetch={false}
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <SquareLibrary className="size-4" />
            </div>
            Delobooks
          </Link>
          <Card className="max-w-sm flex justify-center items-center h-fit">
            <CardContent className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">Login Error</h1>

              <p className="text-destructive">
                {error === "account_not_linked"
                  ? "This account is already linked to another sign-in method."
                  : "Oops! Something went wrong. Please try again."}
              </p>
              <ReturnButton href="/login" label="Login" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
