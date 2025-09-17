/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Shield, Loader2 } from "lucide-react";
import { Key } from "react";

const getRoleColor = (role: any) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-800";
    case "DOCTOR":
      return "bg-blue-100 text-blue-800";
    case "NURSE":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// const getStatusColor = (specialty) => {
//   switch (specialty) {
//     case "Active":
//       return "bg-green-100 text-green-800";
//     case "Inactive":
//       return "bg-red-100 text-red-800";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

type User = {
  id: Key | null | undefined;
  name: string;
  email: string;
  role: string;
  createdAt: string | number | Date;
};

type UserManagementTabProps = {
  users: User[];
  openEditUser: (user: User) => void;
  openDeleteModal: (user: User, type: string) => void;
  setIsUserModalOpen: (open: boolean) => void;
  isLoadingUsers: boolean;
};

const UserManagementTab = ({
  users,
  openEditUser,
  openDeleteModal,
  setIsUserModalOpen,
  isLoadingUsers,
}: UserManagementTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>User Management</span>
          </CardTitle>
          <Button
            onClick={() => {
              setIsUserModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Role
                </th>
                {/* <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Specialty
                </th> */}
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Join Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user: User) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        {user.name || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteModal(user, "user")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementTab;
