import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CartButton from "@/components/user/product/components/cart-button";
import UserLogOut from "@/components/user/product/components/user-log-out";
import { AutoBreadcrumb } from "../components/auto-breadcrumb";

function AppNavbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b rounded-tl-full rounded-tr-full w-full bg-background px-3 ">
      <div className="flex items-center gap-2">
        <SidebarTrigger variant="outline" className="bg-muted/40" />
        <div>
          <AutoBreadcrumb />
        </div>
        <div className=" absolute right-18">
          <CartButton />
        </div>
        <div className=" absolute right-6">
          <UserLogOut />
        </div>
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
    </header>
  );
}

export default AppNavbar;
