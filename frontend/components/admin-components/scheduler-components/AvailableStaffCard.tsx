import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Staff {
  id: number;
  name: string;
  role: string;
  availability: string;
  department: string;
  status: string;
}

interface AvailableStaffCardProps {
  availableStaff: Staff[];
  handleDragStart: (e: React.DragEvent, staff: Staff) => void;
}

export const AvailableStaffCard = ({
  availableStaff,
  handleDragStart,
}: AvailableStaffCardProps) => {
  const getRoleColor = (role: string) => {
    return role === "Doctor"
      ? "text-blue-600 bg-blue-100"
      : "text-green-600 bg-green-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "text-green-600 bg-green-100";
      case "On Leave":
        return "text-red-600 bg-red-100";
      case "Busy":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Available Staff
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableStaff.map((staff) => (
            <div
              key={staff.id}
              className={`p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow ${
                staff.status === "Available"
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-300 opacity-60"
              }`}
              draggable={staff.status === "Available"}
              onDragStart={(e) =>
                staff.status === "Available" && handleDragStart(e, staff)
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm text-gray-900">
                  {staff.name}
                </div>
                <Badge className={getStatusColor(staff.status)}>
                  {staff.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <Badge className={getRoleColor(staff.role)}>{staff.role}</Badge>
                <div className="text-xs text-gray-600">{staff.department}</div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {staff.availability}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
