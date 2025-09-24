import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Variants, Transition } from "framer-motion";

export default function Page() {
  const springShort: Transition = {
    type: "spring",
    bounce: 0.3,
    duration: 1.5,
  };
  const springLong: Transition = { type: "spring", bounce: 0.3, duration: 2 };

  const blurItemVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: springShort,
    },
  };

  const simpleItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: springLong,
    },
  };

  const staggeredContainer: Variants = {
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: 0.75 } as Transition,
    },
  };

  const heroAnimatedVariants: { container?: Variants; item?: Variants } = {
    container: {
      visible: {
        transition: { delayChildren: 1 } as Transition,
      },
    },
    item: simpleItemVariants,
  };

  const buttonsAnimatedVariants: { container?: Variants; item?: Variants } = {
    container: staggeredContainer,
    item: {
      hidden: {
        opacity: 0,
        y: 12,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: springLong,
      },
    },
  };

  return (
    <main className="overflow-hidden">
      <section>
        <div className="relative pt-24 md:pt-36">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={heroAnimatedVariants}>
                <Link
                  href="/login"
                  prefetch={false}
                  className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                >
                  <span className="text-foreground text-sm">
                    Introducing E-books that you can share
                  </span>
                  <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />

                  <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedGroup>

              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="mx-auto mt-8 max-w-4xl text-balance text-white text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
              >
                Modern E-book buying,reading and share platform.
              </TextEffect>

              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="text-white mx-auto mt-8 max-w-2xl text-balance text-lg"
              >
                Highly readable and shareable e-books . Just Buy e-books and
                share e-books to your friends.
              </TextEffect>

              <AnimatedGroup
                variants={buttonsAnimatedVariants}
                className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
              >
                <div
                  key={1}
                  className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl px-5 text-base"
                  >
                    <Link href="/login" prefetch={false}>
                      <span className="text-nowrap">Start Shopping</span>
                    </Link>
                  </Button>
                </div>

                <Button
                  key={2}
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-10.5 rounded-xl px-5 text-white"
                >
                  <Link href="/contact" prefetch={false}>
                    <span className="text-nowrap">Contact Us</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          <AnimatedGroup
            variants={{ container: staggeredContainer, item: blurItemVariants }}
          >
            <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                <Image
                  className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                  src="/dark-hero.jpeg"
                  alt="app screen"
                  priority
                  width={2700}
                  height={1440}
                />
                <Image
                  className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                  src="/light-hero.jpeg"
                  alt="app screen"
                  width={2700}
                  priority
                  height={1440}
                />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </main>
  );
}
