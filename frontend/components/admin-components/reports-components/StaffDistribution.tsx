import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import { StaffDistributionItem } from "@/api/types";

interface StaffDistributionProps {
  staffDistribution: StaffDistributionItem[];
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Doctors":
      return "bg-blue-500";
    case "Nurses":
      return "bg-green-500";
    case "Administrators":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

const StaffDistribution: React.FC<StaffDistributionProps> = ({
  staffDistribution,
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Staff Role Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <div
              className="absolute inset-0 rounded-full border-[24px] border-blue-500"
              style={{
                clipPath:
                  "polygon(50% 50%, 50% 0%, 100% 0%, 100% 35%, 50% 50%)",
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-[24px] border-green-500"
              style={{
                clipPath:
                  "polygon(50% 50%, 100% 35%, 100% 100%, 15% 100%, 50% 50%)",
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-[24px] border-purple-500"
              style={{
                clipPath: "polygon(50% 50%, 15% 100%, 50% 0%, 50% 50%)",
              }}
            ></div>
            <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">128</div>
                <div className="text-sm text-gray-600">Total Staff</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {staffDistribution.map((item, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-4 h-4 ${getRoleColor(
                  item.role
                )} rounded mx-auto mb-2`}
              ></div>
              <div className="text-sm font-medium text-gray-900">
                {item.role}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {item.count}
              </div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffDistribution;
