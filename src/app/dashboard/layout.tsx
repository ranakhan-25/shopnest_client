import SidebarDesktop from "@/components/dashboard/sidebar/SidebarDesktop";
import SidebarMobile from "@/components/dashboard/sidebar/SidebarMobile";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex">

        {/* Desktop Sidebar */}
        <SidebarDesktop />

        <main className="min-w-0 flex-1">

          {/* Mobile Header */}
          <header className="flex h-16 items-center  px-4 lg:hidden">
            <SidebarMobile />

          </header>

          {/* Page */}
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}