import { Card, CardContent } from "@/components/ui/card";
import { Bell, Clock, TrendingUp, Activity } from "lucide-react";
import React from "react";
import { KeyMetricsData } from "@/api/types";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  iconBgColor,
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

interface KeyMetricsProps {
  keyMetrics: KeyMetricsData;
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ keyMetrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Avg Wait Time"
        value={`${keyMetrics.avgWaitTime}m`}
        description="Minutes"
        icon={<Clock className="h-6 w-6 text-white" />}
        iconBgColor="bg-blue-500"
      />
      <StatCard
        title="Staff Efficiency"
        value={`${keyMetrics.staffEfficiency}%`}
        description="Overall rating"
        icon={<TrendingUp className="h-6 w-6 text-white" />}
        iconBgColor="bg-green-500"
      />
      <StatCard
        title="Patient Throughput"
        value={`${keyMetrics.patientThroughput}`}
        description="Patients/day"
        icon={<Activity className="h-6 w-6 text-white" />}
        iconBgColor="bg-purple-500"
      />
      <StatCard
        title="Alerts Resolved"
        value={`${keyMetrics.alertsResolved}`}
        description="Today"
        icon={<Bell className="h-6 w-6 text-white" />}
        iconBgColor="bg-orange-500"
      />
    </div>
  );
};

export default KeyMetrics;
