import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";

const getSeverityColor = (severity) => {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-red-100 text-red-800";
    case "Acknowledged":
      return "bg-yellow-100 text-yellow-800";
    case "Resolved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AlertHistoryTab = ({ filteredHistory }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Alert History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Time
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Department
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Alert Message
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Severity
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Resolved By
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {alert.time}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {alert.department}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {alert.message}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {alert.resolvedBy}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {alert.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertHistoryTab;
