"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn, SubmitHandler } from "react-hook-form";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useId,
  useState,
  Ref,
} from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tag, TagInput } from "emblor";
import {
  AlertCircleIcon,
  FileTextIcon,
  ImageIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { formatBytes, useFileUpload, FileWithPreview, FileMetadata } from "@/hooks/use-file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import { updateEbook } from "./action";

// Define Ebook type
interface Ebook {
  id: string;
  title: string;
  description: string;
  slug: string;
  author: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  pages: number;
  coverImage: string;
  url: string;
  images: string[];
  format: string[];
  category: string;
}

type FormInput = {
  title: string;
  description: string;
  slug: string;
  author: string;
  originalPrice: string;
  discountedPrice: string;
  discountedPercentage?: string | undefined;
  pages: string;
  format: string[];
  category: string;
  coverImage?: File | undefined;
  images: File[];
  ebook?: File | undefined;
  isCoverRemoved?: boolean;
  isEbookRemoved?: boolean;
  deletedImages?: string[];
};

const formSchema = z
  .object({
    title: z.string().min(5, {
      message: "Title must be at least 5 characters long.",
    }),
    description: z.string().min(8, {
      message: "Description must be at least 8 characters long.",
    }),
    slug: z.string().min(3, {
      message: "Slug must be at least 3 characters long.",
    }),
    author: z.string().min(3, {
      message: "Author name must be at least 3 characters long.",
    }),
    originalPrice: z
      .string()
      .min(1, { message: "Original price is required." })
      .refine((val) => !Number.isNaN(Number(val)), {
        message: "Original price must be a valid number.",
      })
      .refine((val) => Number(val) >= 2, {
        message: "Original price must be at least 2.",
      }),
    discountedPrice: z
      .string()
      .min(1, { message: "Discounted price is required." })
      .refine((val) => !Number.isNaN(Number(val)), {
        message: "Discounted price must be a valid number.",
      })
      .refine((val) => Number(val) >= 1, {
        message: "Discounted price must be at least 1.",
      }),
    discountedPercentage: z.string().optional(),
    pages: z
      .string()
      .min(1, { message: "Number of pages is required." })
      .refine((val) => !Number.isNaN(Number(val)), {
        message: "Pages must be a valid number.",
      })
      .refine((val) => Number(val) >= 1, {
        message: "Number of pages must be at least 1.",
      }),
    format: z.array(z.string()).min(1, {
      message: "At least one format is required.",
    }),
    category: z.string().min(3, {
      message: "Category must be at least 3 characters long.",
    }),
    coverImage: z.instanceof(File).optional(),
    images: z.array(z.instanceof(File)).min(0),
    ebook: z.instanceof(File).optional(),
    isCoverRemoved: z.boolean().optional(),
    isEbookRemoved: z.boolean().optional(),
    deletedImages: z.array(z.string()).optional(),
  })
  .refine(
    (data) => Number(data.discountedPrice) <= Number(data.originalPrice),
    {
      message: "Discounted price must not exceed original price.",
      path: ["discountedPrice"],
    }
  );

interface UpdateEbookRef {
  submit: () => void;
  isLoading: boolean;
}

interface UpdateEbookProps {
  ebook: Ebook;
}

const UpdateEbook = forwardRef<UpdateEbookRef, UpdateEbookProps & { ref?: Ref<UpdateEbookRef> }>(
  ({ ebook }, ref) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormInput>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: ebook.title || "",
        description: ebook.description || "",
        slug: ebook.slug || "",
        author: ebook.author || "",
        originalPrice: ebook.originalPrice.toString() || "",
        discountedPrice: ebook.discountedPrice.toString() || "",
        discountedPercentage: undefined,
        pages: ebook.pages.toString() || "",
        format: ebook.format || [],
        category: ebook.category || "",
        coverImage: undefined,
        images: [],
        ebook: undefined,
        isCoverRemoved: false,
        isEbookRemoved: false,
        deletedImages: [],
      },
      mode: "onChange",
    });

    const onSubmit: SubmitHandler<FormInput> = async (values) => {
      if (isLoading) return;

      if (!values.coverImage && (values.isCoverRemoved || !ebook.coverImage)) {
        form.setError("coverImage", { message: "Cover image is required." });
        return;
      }

      if (!values.ebook && (values.isEbookRemoved || !ebook.url)) {
        form.setError("ebook", { message: "E-book file is required." });
        return;
      }

      const keptImages = ebook.images.length - (values.deletedImages?.length || 0);
      if (values.images.length + keptImages < 1) {
        form.setError("images", { message: "At least 1 image is required." });
        return;
      }

      setIsLoading(true);
      const originalPriceNum = Number(values.originalPrice);
      const discountedPriceNum = Number(values.discountedPrice);
      const discountPercentage =
        originalPriceNum > 0
          ? Math.round(
              ((originalPriceNum - discountedPriceNum) / originalPriceNum) * 100
            )
          : 0;

      const transformedValues = {
        ...values,
        originalPrice: Math.round(originalPriceNum),
        discountedPrice: Math.round(discountedPriceNum),
        discountPercentage,
        pages: Number(values.pages),
        coverImage: values.coverImage ?? null,
        ebook: values.ebook ?? null,
        images: values.images,
        toDeleteCover: (values.coverImage || values.isCoverRemoved) && ebook.coverImage ? ebook.coverImage : undefined,
        toDeleteEbook: (values.ebook || values.isEbookRemoved) && ebook.url ? ebook.url : undefined,
        toDeleteImages: values.deletedImages || [],
      };

      try {
        await updateEbook(ebook.slug, transformedValues);
        toast.success("E-book Updated Successfully.");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        toast.error(`Error updating ebook: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isLoading,
    }));

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 h-full overflow-y-auto overflow-x-hidden"
        >
          <div className="grid gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-3 lg:gap-8 h-full">
            <div className="grid auto-rows-max gap-6 lg:col-span-2 h-full">
              <TitleAndDescriptionCard form={form} />
              <DetailsCard form={form} />
              <PricingCard form={form} />
            </div>
            <div className="grid auto-rows-max gap-6 h-full">
              <CoverImageCard form={form} initialCover={ebook.coverImage} />
              <ImagesCard form={form} initialImages={ebook.images} />
              <EbookCard form={form} initialEbook={ebook.url} />
            </div>
          </div>
        </form>
      </Form>
    );
  }
);
UpdateEbook.displayName = "UpdateEbook";

function TitleAndDescriptionCard({ form }: { form: UseFormReturn<FormInput> }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>E-book Details</CardTitle>
        <CardDescription>Enter basic e-book details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-y-auto overflow-x-hidden">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter book title" {...field} />
              </FormControl>
              <FormDescription>Enter the title of the book.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter book description"
                  {...field}
                  className="h-32"
                />
              </FormControl>
              <FormDescription>
                Enter the description of the e-book.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function DetailsCard({ form }: { form: UseFormReturn<FormInput> }) {
  const id = useId();
  const [tags, setTags] = useState<Tag[]>(
    (form.getValues("format") ?? [])
      .filter((text): text is string => text !== undefined)
      .map((text, index) => ({ id: `${index}`, text }))
  );
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "format") {
        const newTags = (value.format ?? [])
          .filter((text): text is string => text !== undefined)
          .map((text, index) => ({ id: `${index}`, text }));
        setTags(newTags);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const currentFormat = form.getValues("format");
    const tagValues = tags.map((tag) => tag.text);
    if (JSON.stringify(tagValues) !== JSON.stringify(currentFormat)) {
      form.setValue("format", tagValues, { shouldValidate: true });
    }
  }, [tags, form]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Additional Details</CardTitle>
        <CardDescription>
          Enter slug, author, pages, format, and category.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-y-auto overflow-x-hidden">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                 <Input placeholder="e-book-slug" {...field} />
              </FormControl>
              <FormDescription>
                Enter the URL slug for the e-book.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Enter the author name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pages</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormDescription>Enter the number of pages.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="format"
          render={() => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <FormControl>
                <TagInput
                  id={id}
                  tags={tags}
                  setTags={(newTags) =>
                    setTags(
                      typeof newTags === "function" ? newTags(tags) : newTags
                    )
                  }
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                  placeholder="Add a format (e.g., PDF, EPUB, MOBI)"
                  styleClasses={{
                    inlineTagsContainer:
                      "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                    input: "w-full min-w-[80px] shadow-none px-2 h-7",
                    tag: {
                      body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                      closeButton:
                        "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                    },
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter formats (e.g., PDF, EPUB, MOBI).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Fiction" {...field} />
              </FormControl>
              <FormDescription>Enter the category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function PricingCard({ form }: { form: UseFormReturn<FormInput> }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <CardDescription>Enter pricing details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-y-auto overflow-x-hidden">
        <FormField
          control={form.control}
          name="originalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original Price</FormLabel>
              <FormControl>
                <div className="relative flex rounded-md shadow-xs">
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
                    &#8377;
                  </span>
                  <Input
                    className="-me-px rounded-e-none ps-6 shadow-none"
                    placeholder="0.00"
                    type="text"
                    {...field}
                  />
                  <span className="border-input bg-background text-muted-foreground z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                    INR
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                Enter the original price in rupees.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discountedPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discounted Price</FormLabel>
              <FormControl>
                <div className="relative flex rounded-md shadow-xs">
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
                    &#8377;
                  </span>
                  <Input
                    className="-me-px rounded-e-none ps-6 shadow-none"
                    placeholder="0.00"
                    type="text"
                    {...field}
                  />
                  <span className="border-input bg-background text-muted-foreground z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                    INR
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                Enter the discounted price in rupees.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function CoverImageCard({
  form,
  initialCover,
}: {
  form: UseFormReturn<FormInput>;
  initialCover: string;
}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB

  const initialFiles: FileMetadata[] = initialCover
    ? [
        {
          id: "cover",
          name: "cover.jpg",
          size: 0,
          type: "image/jpeg",
          url: initialCover,
        },
      ]
    : [];

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile: originalRemoveFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: false,
    initialFiles,
  });

  const removeFile = (id: string) => {
    form.setValue("isCoverRemoved", true, { shouldValidate: true });
    originalRemoveFile(id);
  };

  useEffect(() => {
    const newFile =
      files.length > 0 && files[0].file instanceof File ? files[0].file : undefined;
    form.setValue("coverImage", newFile, { shouldValidate: true });
    if (files.length === 0) {
      form.setValue("isCoverRemoved", true);
    } else {
      form.setValue("isCoverRemoved", false);
    }
    return () => {
      files.forEach((file) => {
        if (file.preview && file.file instanceof File) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files, form]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cover Image</CardTitle>
        <CardDescription>
          Upload one cover image (max {maxSizeMB}MB).
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto overflow-x-hidden">
        <FormField
          control={form.control}
          name="coverImage"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col gap-2 h-full">
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    data-files={files.length > 0 || undefined}
                    className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
                  >
                    <input
                      {...getInputProps()}
                      className="sr-only"
                      aria-label="Upload cover image"
                    />
                    {files.length > 0 ? (
                      <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-medium">
                            Uploaded File ({files.length})
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openFileDialog}
                            disabled={files.length >= 1}
                          >
                            <UploadIcon
                              className="-ms-0.5 size-3.5 opacity-60"
                              aria-hidden="true"
                            />
                            Replace
                          </Button>
                        </div>
                        <div className="grid grid-cols-1">
                          {files.map((file) =>
                            file.preview ? (
                              <div
                                key={file.id}
                                className="bg-accent relative aspect-square rounded-md"
                              >
                                <Image
                                  src={file.preview}
                                  alt={file.file.name}
                                  width={300}
                                  height={300}
                                  className="size-full rounded-[inherit] object-cover"
                                  unoptimized
                                />
                                <Button
                                  onClick={() => removeFile(file.id)}
                                  size="icon"
                                  className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                  aria-label="Remove cover image"
                                >
                                  <XIcon className="size-3.5" />
                                </Button>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                        <div
                          className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                          aria-hidden="true"
                        >
                          <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="mb-1.5 text-sm font-medium">
                          Drop your cover image here
                        </p>
                        <p className="text-muted-foreground text-xs">
                          SVG, PNG, JPG, or GIF (max {maxSizeMB}MB)
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={openFileDialog}
                        >
                          <UploadIcon
                            className="-ms-1 opacity-60"
                            aria-hidden="true"
                          />
                          Select image
                        </Button>
                      </div>
                    )}
                  </div>
                  {(errors.length > 0 || form.formState.errors.coverImage) && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>
                        {errors[0] || form.formState.errors.coverImage?.message}
                      </span>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload one cover image (e.g., JPG, PNG).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function ImagesCard({
  form,
  initialImages,
}: {
  form: UseFormReturn<FormInput>;
  initialImages: string[];
}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB
  const maxFiles = 6;

  const initialFiles: FileMetadata[] = initialImages.map((url, index) => ({
    id: `${index}`,
    name: `image_${index}.jpg`,
    size: 0,
    type: "image/jpeg",
    url,
  }));

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile: originalRemoveFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
    initialFiles,
  });

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file && ! (file.file instanceof File)) {
      const currentDeleted = form.getValues("deletedImages") || [];
      form.setValue("deletedImages", [...currentDeleted, file.file.url]);
    }
    originalRemoveFile(id);
  };

  useEffect(() => {
    const newFiles = files
      .filter((f) => f.file instanceof File)
      .map((f) => f.file as File);
    form.setValue("images", newFiles, { shouldValidate: true });
    return () => {
      files.forEach((file) => {
        if (file.preview && file.file instanceof File) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files, form]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Additional Images</CardTitle>
        <CardDescription>
          Upload up to {maxFiles} images (max {maxSizeMB}MB each).
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto overflow-x-hidden">
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col gap-2 h-full">
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    data-files={files.length > 0 || undefined}
                    className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
                  >
                    <input
                      {...getInputProps()}
                      className="sr-only"
                      aria-label="Upload additional images"
                    />
                    {files.length > 0 ? (
                      <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-medium">
                            Uploaded Files ({files.length})
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openFileDialog}
                            disabled={files.length >= maxFiles}
                          >
                            <UploadIcon
                              className="-ms-0.5 size-3.5 opacity-60"
                              aria-hidden="true"
                            />
                            Add more
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          {files.map((file) =>
                            file.preview ? (
                              <div
                                key={file.id}
                                className="bg-accent relative aspect-square rounded-md"
                              >
                                <Image
                                  src={file.preview}
                                  alt={file.file.name}
                                  width={300}
                                  height={300}
                                  className="size-full rounded-[inherit] object-cover"
                                  unoptimized
                                />
                                <Button
                                  onClick={() => removeFile(file.id)}
                                  size="icon"
                                  className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                                  aria-label="Remove image"
                                >
                                  <XIcon className="size-3.5" />
                                </Button>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                        <div
                          className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                          aria-hidden="true"
                        >
                          <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="mb-1.5 text-sm font-medium">
                          Drop your images here
                        </p>
                        <p className="text-muted-foreground text-xs">
                          SVG, PNG, JPG, or GIF (max {maxSizeMB}MB)
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={openFileDialog}
                        >
                          <UploadIcon
                            className="-ms-1 opacity-60"
                            aria-hidden="true"
                          />
                          Select images
                        </Button>
                      </div>
                    )}
                  </div>
                  {(errors.length > 0 || form.formState.errors.images) && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>
                        {errors[0] || form.formState.errors.images?.message}
                      </span>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload at least 1 additional image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}

function EbookCard({
  form,
  initialEbook,
}: {
  form: UseFormReturn<FormInput>;
  initialEbook: string;
}) {
  const maxSizeMB = 100;
  const maxSize = maxSizeMB * 1024 * 1024; // 100MB

  const getFileNameFromUrl = (url: string) => {
    return url.split("/").pop() || "ebook.pdf";
  };

  const initialFiles: FileMetadata[] = initialEbook
    ? [
        {
          id: "ebook",
          name: getFileNameFromUrl(initialEbook),
          size: 0,
          type: "application/pdf",
          url: initialEbook,
        },
      ]
    : [];

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      removeFile: originalRemoveFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "application/pdf",
    maxSize,
    multiple: false,
    initialFiles,
  });

  const removeFile = (id: string) => {
    form.setValue("isEbookRemoved", true, { shouldValidate: true });
    originalRemoveFile(id);
  };

  useEffect(() => {
    const newFile =
      files.length > 0 && files[0].file instanceof File ? files[0].file : undefined;
    form.setValue("ebook", newFile, { shouldValidate: true });
    if (files.length === 0) {
      form.setValue("isEbookRemoved", true);
    } else {
      form.setValue("isEbookRemoved", false);
    }
    return () => {
      files.forEach((file) => {
        if (file.preview && file.file instanceof File) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files, form]);

  const getFileIcon = (file: FileWithPreview) => {
    const fileType = file.file.type;
    const fileName = file.file.name;

    if (
      fileType.includes("pdf") ||
      fileName.endsWith(".pdf") ||
      fileType.includes("word") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      return <FileTextIcon className="size-4 opacity-60" />;
    }
    return <FileTextIcon className="size-4 opacity-60" />;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>E-book File</CardTitle>
        <CardDescription>
          Upload one e-book PDF file (max {maxSizeMB}MB).
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full overflow-y-auto overflow-x-hidden">
        <FormField
          control={form.control}
          name="ebook"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col gap-2 h-full">
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                  >
                    <input
                      {...getInputProps()}
                      className="sr-only"
                      aria-label="Upload e-book file"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <FileTextIcon className="size-4 opacity-60" />
                      </div>
                      <p className="mb-1.5 text-sm font-medium">
                        Upload e-book file
                      </p>
                      <p className="text-muted-foreground mb-2 text-xs">
                        Drag & drop or click to browse
                      </p>
                      <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
                        <span>PDF</span>
                        <span>∙</span>
                        <span>Max 1 file</span>
                        <span>∙</span>
                        <span>Up to {formatBytes(maxSize)}</span>
                      </div>
                    </div>
                  </div>
                  {(errors.length > 0 || form.formState.errors.ebook) && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>
                        {errors[0] || form.formState.errors.ebook?.message}
                      </span>
                    </div>
                  )}
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                              {getFileIcon(file)}
                            </div>
                            <div className="flex min-w-0 flex-col gap-0.5">
                              <p className="truncate text-[13px] font-medium">
                                {file.file.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {formatBytes(file.file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                            onClick={() => removeFile(file.id)}
                            aria-label="Remove e-book file"
                          >
                            <XIcon className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      ))}
                      {files.length > 0 && (
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={clearFiles}
                          >
                            Remove file
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Upload the e-book file (PDF).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4" hidden>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}

export default UpdateEbook;