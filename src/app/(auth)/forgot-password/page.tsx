
import ForgotPasswordForm from "@/components/auth/forgot-password/form";
import { SquareLibrary } from "lucide-react";
import Link from "next/link";
import React from "react";

function ForgotPassword() {
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
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
