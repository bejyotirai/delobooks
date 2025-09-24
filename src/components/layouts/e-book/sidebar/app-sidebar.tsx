import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
    BookAIcon,
  Contact2Icon,
  GlobeLock,
  ShoppingBasket,
  SquareLibrary,
  SquareTerminal,
} from "lucide-react";
import ModeToggleAdminSideBar from "../../admin/components/mode-toggle";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Core Services",
      items: [
        {
          title: "E-books",
          icon: BookAIcon,
          url: "/e-books",
        },
        {
          title: "About",
          icon: ShoppingBasket,
          url: "/about",
        },
        {
          title: "Contact",
          icon: Contact2Icon,
          url: "/contact",
        },
        {
          title: "Terms of Service",
          icon: SquareTerminal,
          url: "/terms-of-service",
        },
        {
          title: "Privacy Policy",
          icon: GlobeLock,
          url: "/privacy-policy",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" prefetch={false}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SquareLibrary className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Delobooks</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={false}>
                      <a href={item.url}>
                        <item.icon />
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <ModeToggleAdminSideBar />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
