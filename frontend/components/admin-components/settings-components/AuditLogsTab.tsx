import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText } from "lucide-react";

const getSeverityColor = (severity) => {
  switch (severity) {
    case "Info":
      return "bg-blue-100 text-blue-800";
    case "Warning":
      return "bg-yellow-100 text-yellow-800";
    case "Error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AuditLogsTab = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserFilter, setSelectedUserFilter] = useState("all");
  const [selectedActionFilter, setSelectedActionFilter] = useState("all");

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser =
      selectedUserFilter === "all" ||
      log.userRole.toLowerCase() === selectedUserFilter.toLowerCase();

    const matchesAction =
      selectedActionFilter === "all" ||
      log.category.toLowerCase().includes(selectedActionFilter.toLowerCase());

    return matchesSearch && matchesUser && matchesAction;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Audit Logs</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select
              value={selectedUserFilter}
              onValueChange={setSelectedUserFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedActionFilter}
              onValueChange={setSelectedActionFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="scheduling">Scheduling</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  User
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Action
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Details
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{log.timestamp}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{log.user}</div>
                    <div className="text-xs text-gray-500">{log.userRole}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {log.action}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {log.details}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-gray-100 text-gray-800">
                      {log.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
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

export default AuditLogsTab;
