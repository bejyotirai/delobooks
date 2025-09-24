"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function ModeToggleAdminSideBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {

    return (
      <SidebarMenuButton size="lg" disabled>
        <MoonIcon className="h-5 w-5 opacity-0" />
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button
          variant="default"
          size="lg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex justify-center items-center w-full"
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}{" "}
          {theme === "dark" ? <b>Dark Mode</b> : <b>Light Mode</b>}
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
