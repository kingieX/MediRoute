import Link from "next/link";
import { Calendar, Users, MapPin, Bell, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quickAccessItems = [
  {
    title: "Manage Shifts",
    description: "Oversee and optimize staff schedules",
    icon: Calendar,
    path: "/dashboard/admin/scheduler",
  },
  {
    title: "Monitor Patient Flow",
    description: "Track patient journey from admission to discharge",
    icon: Users,
    path: "/dashboard/admin/patients",
  },
  {
    title: "Hospital Map",
    description: "Navigate hospital layout and locate resources",
    icon: MapPin,
    path: "/dashboard/admin/map",
  },
  {
    title: "View Alerts",
    description: "Address critical notifications and incidents",
    icon: Bell,
    path: "/dashboard/admin/alerts",
  },
  {
    title: "Analytics Reports",
    description: "Generate insights from operational data",
    icon: BarChart3,
    path: "/dashboard/admin/reports",
  },
];

export const QuickAccess = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickAccessItems.map((item) => (
          <Link key={item.title} href={item.path}>
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
