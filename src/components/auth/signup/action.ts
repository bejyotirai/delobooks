"use server";
import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

interface values {
    name: string;
    email: string;
    password: string;
}

export default async function SignUpWithEmailAndPasswordAction({ name, email, password }: values) {

    if (!name) return { error: "Please enter your name" };
    if (!email) return { error: "Please enter your email" };
    if (!password) return { error: "Please enter your password" };
    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });

        return { error: null };
    } catch (err) {
        if (err instanceof APIError) {

            const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";
            switch (errCode) {
                case "USER_ALREADY_EXISTS":
                    return { error: "Oops! Something Went Wrong. Please Try Again." };
                default:
                    return { error: err.message };
            }
        }

        return { error: "Internal Server Error" };
    }
}

