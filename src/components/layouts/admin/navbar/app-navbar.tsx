import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserLogOut from "@/components/user/product/components/user-log-out";

import React from "react";
import { AutoBreadcrumb } from "../../user/components/auto-breadcrumb";

function AppNavbar() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b rounded-tl-full rounded-tr-full w-full bg-background px-3 ">
        <div className="flex items-center gap-2 ">
          <SidebarTrigger variant="outline" className="bg-muted/40" />
          <div>
            <AutoBreadcrumb />
          </div>
          <div className=" absolute right-4">
            <UserLogOut />
          </div>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>
    </>
  );
}

export default AppNavbar;
