import { Users, Bell, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardsProps {
  stats: {
    totalStaff: number;
    patientsWaiting: number;
    activeAlerts: number;
    overCapacityDepts: number;
  };
}

const statCardItems = [
  {
    title: "Total Staff On Duty",
    key: "totalStaff",
    subtitle: "Currently active",
    color: "bg-blue-500",
    icon: Users,
  },
  {
    title: "Patients Waiting",
    key: "patientsWaiting",
    subtitle: "Across all departments",
    color: "bg-red-500",
    icon: Users,
  },
  {
    title: "Active Alerts",
    key: "activeAlerts",
    subtitle: "Unresolved issues",
    color: "bg-yellow-500",
    icon: Bell,
  },
  {
    title: "Departments Over Capacity",
    key: "overCapacityDepts",
    subtitle: "Requires immediate attention",
    color: "bg-orange-500",
    icon: BarChart3,
  },
];

export const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCardItems.map((card) => (
        <Card key={card.title} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats[card.key as keyof typeof stats]}
                </p>
                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
