"use server";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function deleteSelected(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const ids = formData.get("ids")?.toString().split(",") ?? [];
  const coverImages = formData.get("coverImages")?.toString().split(",") ?? [];
  const urls = formData.get("urls")?.toString().split(",") ?? [];
  const images = formData.get("images")?.toString().split(",") ?? [];

  try {
    const filesToDelete: string[] = [];
    coverImages.forEach((coverImage) => {
      if (coverImage) {
        const coverPath = coverImage.split("/").slice(-1)[0];
        filesToDelete.push(`images/${coverPath}`);
      }
    });

    urls.forEach((url) => {
      if (url) {
        const ebookPath = url.split("/").slice(-1)[0];
        filesToDelete.push(`files/${ebookPath}`);
      }
    });

    images.forEach((image) => {
      if (image) {
        const imagePath = image.split("/").slice(-1)[0];
        filesToDelete.push(`images/${imagePath}`);
      }
    });

    if (filesToDelete.length > 0) {
      const imageFiles = filesToDelete.filter((path) =>
        path.startsWith("images/")
      );
      if (imageFiles.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("images")
          .remove(imageFiles);
        if (storageError) {
          throw new Error(
            `Failed to delete image files: ${storageError.message}`
          );
        }
      }

      const ebookFiles = filesToDelete.filter((path) =>
        path.startsWith("files/")
      );
      if (ebookFiles.length > 0) {
        const { error: fileError } = await supabase.storage
          .from("files")
          .remove(ebookFiles);
        if (fileError) {
          throw new Error(`Failed to delete ebook files: ${fileError.message}`);
        }
      }
    }


    await prisma.orderItem.deleteMany({
      where: {
        ebookId: { in: ids },
      },
    });


    await prisma.ebook.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting ebooks:", error);
    return { success: false, error: (error as Error).message };
  } finally {
    await prisma.$disconnect();
  }
}