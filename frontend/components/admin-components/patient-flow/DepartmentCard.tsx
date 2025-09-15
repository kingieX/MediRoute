import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  status: string;
  waitTime: string;
  priority: string;
  admissionTime: string;
}

interface Department {
  id: number;
  name: string;
  status: string;
  loadIndicator: "red" | "yellow" | "green";
  capacity: number;
  patients: Patient[];
}

interface DepartmentCardProps {
  department: Department;
}

const getLoadIndicatorColor = (indicator: "red" | "yellow" | "green") => {
  switch (indicator) {
    case "red":
      return "bg-red-500";
    case "yellow":
      return "bg-yellow-500";
    case "green":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Waiting":
      return "bg-yellow-100 text-yellow-800";
    case "In Treatment":
      return "bg-blue-100 text-blue-800";
    case "Ready for Discharge":
      return "bg-green-100 text-green-800";
    case "Critical Care":
      return "bg-red-100 text-red-800";
    case "Monitoring":
      return "bg-purple-100 text-purple-800";
    case "Pre-Op":
      return "bg-orange-100 text-orange-800";
    case "Post-Op Recovery":
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800";
    case "High":
      return "bg-orange-100 text-orange-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const DepartmentCard = ({ department }: DepartmentCardProps) => (
  <Card key={department.id} className="overflow-hidden">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-4 h-4 rounded-full ${getLoadIndicatorColor(
              department.loadIndicator
            )}`}
          ></div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {department.name}
          </CardTitle>
        </div>
        <Badge
          className={
            department.loadIndicator === "red"
              ? "bg-red-100 text-red-800"
              : department.loadIndicator === "yellow"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }
        >
          {department.status}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Capacity: {department.capacity}%</span>
        <span>{department.patients.length} patients</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getLoadIndicatorColor(
            department.loadIndicator
          )}`}
          style={{
            width: `${Math.min(department.capacity, 100)}%`,
          }}
        ></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {department.patients.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>No patients in queue</p>
          </div>
        ) : (
          department.patients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {patient.name}
                  </span>
                  <Badge className={getPriorityColor(patient.priority)}>
                    {patient.priority}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Admitted: {patient.admissionTime}</span>
                  <span>Wait: {patient.waitTime}</span>
                </div>
              </div>
              <Badge className={getStatusColor(patient.status)}>
                {patient.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);
