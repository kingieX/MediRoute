"use client";

import { Sidebar } from "@/components/admin-components/Sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/admin-components/SidebarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 lg:ml-0">
        <main className="">{children}</main>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
