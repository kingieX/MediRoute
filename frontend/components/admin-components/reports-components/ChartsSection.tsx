import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import { StaffUtilizationItem, PatientCongestionItem } from "@/api/types";

interface ChartsSectionProps {
  staffUtilization: StaffUtilizationItem[];
  patientCongestion: PatientCongestionItem[];
}

const getUtilizationColor = (percentage: number) => {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 70) return "bg-yellow-500";
  return "bg-green-500";
};

const ChartsSection: React.FC<ChartsSectionProps> = ({
  staffUtilization,
  patientCongestion,
}) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Staff Utilization Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-end justify-between space-x-2">
            {staffUtilization.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-64 space-y-1">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{ height: `${(item.doctors / 25) * 100}%` }}
                    title={`Doctors: ${item.doctors}`}
                  ></div>
                  <div
                    className="bg-green-500 rounded-t"
                    style={{ height: `${(item.nurses / 30) * 100}%` }}
                    title={`Nurses: ${item.nurses}`}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">{item.time}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Doctors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Nurses</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Department Congestion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientCongestion.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {dept.department}
                  </span>
                  <span className="text-sm text-gray-600">
                    {dept.current}/{dept.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getUtilizationColor(
                      dept.percentage
                    )}`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {dept.percentage}% capacity
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
