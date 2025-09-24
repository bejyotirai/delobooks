'use server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';

interface UpdateEbookProps {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  pages: number;
  coverImage: File | null;
  ebook: File | null;
  title: string;
  description: string;
  slug: string;
  author: string;
  format: string[];
  category: string;
  images: File[];
  toDeleteCover?: string;
  toDeleteEbook?: string;
  toDeleteImages: string[];
}

async function deleteFromStorage(bucket: string, url: string) {
  if (!url) return;
  const supabase = createSupabaseServerClient();
  const { data: { publicUrl: base } } = supabase.storage.from(bucket).getPublicUrl('');
  const path = url.replace(base, '');
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`Failed to delete from storage: ${error.message}`);
  }
}

export async function getEbook(slug: string) {
  try {
    const ebook = await prisma.ebook.findUnique({
      where: { slug },
    });
    return ebook;
  } catch (error) {
    console.error('Error fetching ebook:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateEbook(slug: string, props: UpdateEbookProps) {
  try {

    if (!props.title || !props.slug || !props.author || !props.category) {
      throw new Error('Missing required fields: title, slug, author, or category');
    }

    const supabase = createSupabaseServerClient();
    const bucketImages = 'images';
    const bucketFiles = 'files';


    const currentEbook = await prisma.ebook.findUnique({ where: { slug } });
    if (!currentEbook) {
      throw new Error('E-book not found');
    }


    if (props.toDeleteCover) {
      await deleteFromStorage(bucketImages, props.toDeleteCover);
    }
    if (props.toDeleteEbook) {
      await deleteFromStorage(bucketFiles, props.toDeleteEbook);
    }
    for (const img of props.toDeleteImages) {
      await deleteFromStorage(bucketImages, img);
    }


    let coverImage = currentEbook.coverImage;
    if (props.coverImage) {
      const coverFileExt = props.coverImage.name.split('.').pop();
      const coverFileName = `cover_${props.slug}_${Date.now()}.${coverFileExt}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from(bucketImages)
        .upload(coverFileName, props.coverImage, {
          contentType: props.coverImage.type,
          upsert: false,
        });

      if (coverError || !coverData) {
        throw new Error(`Cover image upload failed: ${coverError?.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketImages)
        .getPublicUrl(coverData.path);
      coverImage = publicUrl;
    }


    let url = currentEbook.url;
    if (props.ebook) {
      const ebookFileExt = props.ebook.name.split('.').pop();
      const ebookFileName = `ebook_${props.slug}_${Date.now()}.${ebookFileExt}`;
      const { data: ebookData, error: ebookError } = await supabase.storage
        .from(bucketFiles)
        .upload(ebookFileName, props.ebook, {
          contentType: props.ebook.type,
          upsert: false,
        });

      if (ebookError || !ebookData) {
        throw new Error(`Ebook file upload failed: ${ebookError?.message}`);
      }

      const { data: { publicUrl: newUrl } } = supabase.storage
        .from(bucketFiles)
        .getPublicUrl(ebookData.path);
      url = newUrl;
    }


    const images = currentEbook.images.filter((img: string) => !props.toDeleteImages.includes(img));
    if (props.images.length > 0) {
      for (const [index, image] of props.images.entries()) {
        const imageFileExt = image.name.split('.').pop();
        const imageFileName = `image_${props.slug}_${index}_${Date.now()}.${imageFileExt}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from(bucketImages)
          .upload(imageFileName, image, {
            contentType: image.type,
            upsert: false,
          });

        if (imageError || !imageData) {
          throw new Error(`Image ${index + 1} upload failed: ${imageError?.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucketImages)
          .getPublicUrl(imageData.path);
        images.push(publicUrl);
      }
    }


    const updatedEbook = await prisma.ebook.update({
      where: { slug },
      data: {
        title: props.title,
        description: props.description,
        slug: props.slug,
        author: props.author,
        originalPrice: Math.round(props.originalPrice),
        discountedPrice: Math.round(props.discountedPrice),
        discountPercentage: Math.round(props.discountPercentage),
        pages: props.pages,
        coverImage,
        url,
        images,
        format: props.format,
        category: props.category,
      },
    });


    return { success: true, ebookId: updatedEbook.id };
  } catch (error) {
    console.error('Error updating ebook:', error);
    return { success: false, error: (error as Error).message };
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteEbook(slug: string) {
  try {
    const bucketImages = 'images';
    const bucketFiles = 'files';


    const ebook = await prisma.ebook.findUnique({ where: { slug } });
    if (!ebook) {
      throw new Error('E-book not found');
    }


    if (ebook.coverImage) {
      await deleteFromStorage(bucketImages, ebook.coverImage);
    }
    if (ebook.url) {
      await deleteFromStorage(bucketFiles, ebook.url);
    }
    for (const img of ebook.images) {
      await deleteFromStorage(bucketImages, img);
    }

   
    await prisma.ebook.delete({ where: { slug } });

    return { success: true };
  } catch (error) {
    console.error('Error deleting ebook:', error);
    return { success: false, error: (error as Error).message };
  } finally {
    await prisma.$disconnect();
  }
}