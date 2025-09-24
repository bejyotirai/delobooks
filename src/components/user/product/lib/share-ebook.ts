'use server';

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function shareEbook(ebookId: string, toEmail: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.user.id;

  const toUser = await prisma.user.findUnique({ where: { email: toEmail } });
  if (!toUser) {
    return { success: false, error: "User not found" };
  }

  if (toUser.id === userId) {
    return { success: false, error: "Cannot share to yourself" };
  }

  const owned = await prisma.ownedEbook.findUnique({
    where: { userId_ebookId: { userId, ebookId } },
  });

  if (!owned || owned.available <= 1) {
    return { success: false, error: "Cannot share: insufficient copies" };
  }

  const existingShare = await prisma.sharedEbook.findUnique({
    where: {
      fromUserId_toUserId_ebookId: {
        fromUserId: userId,
        toUserId: toUser.id,
        ebookId,
      },
    },
  });

  if (existingShare) {
    return { success: false, error: "Already shared with this user" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.sharedEbook.create({
      data: {
        fromUserId: userId,
        toUserId: toUser.id,
        ebookId,
        ownedEbookId: owned.id,
      },
    });

    await tx.ownedEbook.update({
      where: { id: owned.id },
      data: { available: { decrement: 1 } },
    });
  });

  return { success: true };
}