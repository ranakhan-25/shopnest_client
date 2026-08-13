"use client";

import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { useAuthStore } from "@/components/store/authStore";

const DashboardPage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4">
        <p className="text-sm text-black/50 dark:text-white/50">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl ">
      {(() => {
        switch (user.role) {
          case "admin":
            return <AdminDashboard />;

          case "seller":
            return <SellerDashboard />;

          case "user":
          default:
            return <UserDashboard />;
        }
      })()}
    </main>
  );
};

export default DashboardPage;