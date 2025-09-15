import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bell, Clock, CheckCircle } from "lucide-react";
import React from "react";

const StatCard = ({
  title,
  value,
  description,
  icon,
  iconBgColor,
  valueColor,
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const OverviewStats = ({
  criticalAlerts,
  totalActiveAlerts,
  acknowledgedAlerts,
  resolvedToday,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Critical Alerts"
        value={criticalAlerts}
        description="Require immediate attention"
        icon={<AlertTriangle className="h-6 w-6 text-white" />}
        iconBgColor="bg-red-500"
        valueColor="text-red-600"
      />
      <StatCard
        title="Active Alerts"
        value={totalActiveAlerts}
        description="Currently unresolved"
        icon={<Bell className="h-6 w-6 text-white" />}
        iconBgColor="bg-orange-500"
        valueColor="text-orange-600"
      />
      <StatCard
        title="Acknowledged"
        value={acknowledgedAlerts}
        description="Awaiting resolution"
        icon={<Clock className="h-6 w-6 text-white" />}
        iconBgColor="bg-yellow-500"
        valueColor="text-yellow-600"
      />
      <StatCard
        title="Resolved Today"
        value={resolvedToday}
        description="Successfully handled"
        icon={<CheckCircle className="h-6 w-6 text-white" />}
        iconBgColor="bg-green-500"
        valueColor="text-green-600"
      />
    </div>
  );
};

export default OverviewStats;
