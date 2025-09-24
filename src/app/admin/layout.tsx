import AppNavbar from "@/components/layouts/admin/navbar/app-navbar";
import { AppSidebar } from "@/components/layouts/admin/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col w-full min-h-screen">
          <AppNavbar />
          <main className="flex-1 bg-muted/40 w-full">
            {children}
          </main>
        </div>
      </SidebarInset>
    </>
  );
}

export default AdminLayout;