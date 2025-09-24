'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CreateEbookProps {
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
}

export default async function createEbook(props: CreateEbookProps) {
  try {

    if (!props.title || !props.slug || !props.author || !props.category) {
      throw new Error('Missing required fields: title, slug, author, or category');
    }
    if (!props.coverImage) {
      throw new Error('Cover image is required');
    }
    if (!props.ebook) {
      throw new Error('Ebook file is required');
    }

    const supabase = createSupabaseServerClient();
    const bucketImages = 'images';
    const bucketFiles = 'files';


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


    const { data: { publicUrl: coverImage } } = supabase.storage
      .from(bucketImages)
      .getPublicUrl(coverData.path);


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


    const { data: { publicUrl: url } } = supabase.storage
      .from(bucketFiles)
      .getPublicUrl(ebookData.path);


    const images: string[] = [];
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


    const newEbook = await prisma.ebook.create({
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

    revalidatePath('/admin/e-books');
    return { success: true, ebookId: newEbook.id, coverImage, url, images };
  } catch (error) {
    console.error('Error creating ebook:', error);
    return { success: false, error: (error as Error).message };
  } finally {
    await prisma.$disconnect();
  }
}