import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, AlertTriangle, BarChart3 } from "lucide-react";

interface StatsGridProps {
  totalPatients: number;
  waitingPatients: number;
  criticalPatients: number;
  overloadedDepartments: number;
}

export const StatsGrid = ({
  totalPatients,
  waitingPatients,
  criticalPatients,
  overloadedDepartments,
}: StatsGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Total Patients
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
            <p className="text-sm text-gray-500 mt-1">Across all departments</p>
          </div>
          <div className="p-3 rounded-full bg-blue-500">
            <Users className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Patients Waiting
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {waitingPatients}
            </p>
            <p className="text-sm text-gray-500 mt-1">Currently in queue</p>
          </div>
          <div className="p-3 rounded-full bg-yellow-500">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Critical Patients
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {criticalPatients}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Require immediate attention
            </p>
          </div>
          <div className="p-3 rounded-full bg-red-500">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Overloaded Departments
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {overloadedDepartments}
            </p>
            <p className="text-sm text-gray-500 mt-1">Need redistribution</p>
          </div>
          <div className="p-3 rounded-full bg-orange-500">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
