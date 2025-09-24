"use server";

import { auth, ErrorCode } from "@/lib/auth";
import {
  headers,
} from "next/headers";

import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
interface values {
  email: string;
  password: string;
}

export default async function LoginWithEmailAndPasswordAction({ email, password }: values) {
  if (!email) return { error: "Please enter your email" };
  if (!password) return { error: "Please enter your password" };
  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
    });

    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {

      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";
      switch (errCode) {
        case "EMAIL_NOT_VERIFIED":
          redirect("/verify?error=email_not_verified");
        default:
          return { error: err.message };
      }
    }

    return { error: "Internal Server Error" };
  }
}



