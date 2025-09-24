"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function AutoBreadcrumb() {
  const pathname = usePathname();


  const segments = pathname.split("/").filter(Boolean);


  const crumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return { segment: capitalize(decodeURIComponent(segment)), href };
  });

  return (
    <div className="w-full overflow-x-auto">
      <Breadcrumb>
        <BreadcrumbList className="flex whitespace-nowrap">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;

            return (
              <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <span className="font-medium text-foreground">{crumb.segment}</span>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.segment}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
