import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building } from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "Normal":
      return "bg-green-100 text-green-800";
    case "Near Capacity":
      return "bg-yellow-100 text-yellow-800";
    case "Overloaded":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const DepartmentSetupTab = ({
  departments,
  openEditDepartment,
  openDeleteModal,
  setIsDepartmentModalOpen,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Department Setup</span>
          </CardTitle>
          <Button
            onClick={() => {
              setIsDepartmentModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Department
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Capacity
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Current Load
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Manager
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr
                  key={department.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {department.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {department.capacity} (Threshold: {department.threshold})
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-900">
                        {department.currentLoad}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            department.currentLoad > department.threshold
                              ? "bg-red-500"
                              : department.currentLoad >
                                department.threshold * 0.8
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (department.currentLoad / department.capacity) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(department.status)}>
                      {department.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {department.manager}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDepartment(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openDeleteModal(department, "department")
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default DepartmentSetupTab;
