import ResetPasswordForm from "@/components/auth/reset-password/form";
import { SquareLibrary } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  searchParams: Promise<{ token: string }>;
}

async function ForgotPassword({ searchParams }: PageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/login");
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
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
