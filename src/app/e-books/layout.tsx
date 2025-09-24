import AppNavbar from "@/components/layouts/e-book/navbar/app-navbar";
import { AppSidebar } from "@/components/layouts/e-book/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

function DashbordLayout({ children }: { children: React.ReactNode }) {
  return (
   <>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="w-full min-h-screen">
          <AppNavbar />
          <main className="bg-muted min-h-screen min-w-full">
            {children}
          </main>
        </div>
      </SidebarInset>
    </>
  );
}

export default DashbordLayout;
