"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  MapPin,
  Bell,
  BarChart3,
  Settings,
  Stethoscope,
  X,
  LucideLayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const sidebarItems = [
  {
    label: "Admin Dashboard",
    icon: LucideLayoutDashboard,
    path: "/dashboard/admin",
  },
  {
    label: "Shift Scheduler",
    icon: Calendar,
    path: "/dashboard/admin/scheduler",
  },
  {
    label: "Patient Flow",
    icon: Users,
    path: "/dashboard/admin/patients",
  },
  {
    label: "Real-Time Map",
    icon: MapPin,
    path: "/dashboard/admin/map",
  },
  { label: "Alerts", icon: Bell, path: "/dashboard/admin/alerts" },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/dashboard/admin/reports",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/dashboard/admin/settings",
  },
];

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">MediRoute</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
