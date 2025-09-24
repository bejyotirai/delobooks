import AppFooter from "@/components/layouts/home/footer/app-footer";
import { AppHeader } from "@/components/layouts/home/header/app-header";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#0f172a] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#0f172a",
          backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px),
        radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />

      <AppHeader />
      <main className="relative z-10 min-h-screen w-full mt-8">
        {children} <AppFooter />
      </main>
    </div>
  );
}

export default HomeLayout;
