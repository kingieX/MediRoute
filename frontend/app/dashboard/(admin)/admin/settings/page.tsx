"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Bell,
  BarChart3,
  Settings,
  Menu,
  X,
  Shield,
  Building,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopNavigation from "@/components/admin-components/settings-components/TopNavigation";
import NotificationList from "@/components/admin-components/settings-components/NotificationList";
import UserManagementTab from "@/components/admin-components/settings-components/UserManagementTab";
import DepartmentSetupTab from "@/components/admin-components/settings-components/DepartmentSetupTab";
import AuditLogsTab from "@/components/admin-components/settings-components/AuditLogsTab";
import UserModal from "@/components/ui/modals/UserModal";
import DepartmentModal from "@/components/ui/modals/DepartmentModal";
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal";

const SettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@mediroute.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2025-01-06 09:30",
      createdAt: "2024-12-01",
    },
    {
      id: 2,
      name: "Dr. John Smith",
      email: "john.smith@mediroute.com",
      role: "Doctor",
      status: "Active",
      lastLogin: "2025-01-06 08:45",
      createdAt: "2024-12-15",
    },
    {
      id: 3,
      name: "Nurse Jane Doe",
      email: "jane.doe@mediroute.com",
      role: "Nurse",
      status: "Active",
      lastLogin: "2025-01-06 09:15",
      createdAt: "2025-01-02",
    },
    {
      id: 4,
      name: "Dr. Emily Chen",
      email: "emily.chen@mediroute.com",
      role: "Doctor",
      status: "Inactive",
      lastLogin: "2025-01-05 16:20",
      createdAt: "2024-11-20",
    },
  ]);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Emergency",
      capacity: 50,
      threshold: 40,
      currentLoad: 35,
      status: "Normal",
      manager: "Dr. Sarah Johnson",
      lastUpdated: "2025-01-06",
    },
    {
      id: 2,
      name: "ICU",
      capacity: 20,
      threshold: 16,
      currentLoad: 18,
      status: "Near Capacity",
      manager: "Dr. Michael Brown",
      lastUpdated: "2025-01-06",
    },
    {
      id: 3,
      name: "Pediatrics",
      capacity: 40,
      threshold: 32,
      currentLoad: 25,
      status: "Normal",
      manager: "Dr. Lisa Anderson",
      lastUpdated: "2025-01-06",
    },
    {
      id: 4,
      name: "Surgery",
      capacity: 30,
      threshold: 24,
      currentLoad: 15,
      status: "Normal",
      manager: "Dr. Robert Davis",
      lastUpdated: "2025-01-05",
    },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: "2025-01-06 14:30:15",
      user: "Dr. Sarah Johnson",
      userRole: "Admin",
      action: "User Created",
      details: "Created new user: Dr. Emily Chen",
      category: "User Management",
      severity: "Info",
    },
    {
      id: 2,
      timestamp: "2025-01-06 14:15:22",
      user: "System",
      userRole: "System",
      action: "Alert Triggered",
      details: "Emergency Department reaching capacity (85%)",
      category: "Alert",
      severity: "Warning",
    },
    {
      id: 3,
      timestamp: "2025-01-06 13:45:10",
      user: "Dr. John Smith",
      userRole: "Doctor",
      action: "Shift Assigned",
      details: "Self-assigned to Emergency Department (16:00-00:00)",
      category: "Scheduling",
      severity: "Info",
    },
    {
      id: 4,
      timestamp: "2025-01-06 13:30:05",
      user: "Nurse Jane Doe",
      userRole: "Nurse",
      action: "Patient Rerouted",
      details: "Moved patient John Doe from ER to ICU",
      category: "Patient Management",
      severity: "Info",
    },
    {
      id: 5,
      timestamp: "2025-01-06 12:15:33",
      user: "Dr. Sarah Johnson",
      userRole: "Admin",
      action: "Department Updated",
      details: "Updated ICU capacity from 18 to 20",
      category: "Department Management",
      severity: "Info",
    },
    {
      id: 6,
      timestamp: "2025-01-06 11:20:18",
      user: "System",
      userRole: "System",
      action: "System Backup",
      details: "Daily system backup completed successfully",
      category: "System",
      severity: "Info",
    },
  ]);

  const addNotification = (type, message) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const handleSaveUser = (userForm) => {
    if (!userForm.name || !userForm.email || !userForm.role) {
      addNotification("error", "Please fill in all required fields");
      return;
    }

    if (selectedItem) {
      // Edit existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedItem.id
            ? { ...user, ...userForm, lastUpdated: new Date().toISOString() }
            : user
        )
      );
      addNotification("success", `User ${userForm.name} updated successfully`);
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...userForm,
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, newUser]);
      addNotification("success", `User ${userForm.name} created successfully`);
    }

    // Add audit log
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      user: "Dr. Sarah Johnson",
      userRole: "Admin",
      action: selectedItem ? "User Updated" : "User Created",
      details: `${selectedItem ? "Updated" : "Created"} user: ${userForm.name}`,
      category: "User Management",
      severity: "Info",
    };
    setAuditLogs((prev) => [logEntry, ...prev]);

    setSelectedItem(null);
    setIsUserModalOpen(false);
  };

  const handleSaveDepartment = (departmentForm) => {
    if (
      !departmentForm.name ||
      !departmentForm.capacity ||
      !departmentForm.threshold
    ) {
      addNotification("error", "Please fill in all required fields");
      return;
    }

    if (
      parseInt(departmentForm.threshold) > parseInt(departmentForm.capacity)
    ) {
      addNotification("error", "Threshold cannot be greater than capacity");
      return;
    }

    if (selectedItem) {
      // Edit existing department
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === selectedItem.id
            ? {
                ...dept,
                ...departmentForm,
                capacity: parseInt(departmentForm.capacity),
                threshold: parseInt(departmentForm.threshold),
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : dept
        )
      );
      addNotification(
        "success",
        `Department ${departmentForm.name} updated successfully`
      );
    } else {
      // Add new department
      const newDepartment = {
        id: Date.now(),
        ...departmentForm,
        capacity: parseInt(departmentForm.capacity),
        threshold: parseInt(departmentForm.threshold),
        currentLoad: 0,
        status: "Normal",
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setDepartments((prev) => [...prev, newDepartment]);
      addNotification(
        "success",
        `Department ${departmentForm.name} created successfully`
      );
    }

    // Add audit log
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      user: "Dr. Sarah Johnson",
      userRole: "Admin",
      action: selectedItem ? "Department Updated" : "Department Created",
      details: `${selectedItem ? "Updated" : "Created"} department: ${
        departmentForm.name
      }`,
      category: "Department Management",
      severity: "Info",
    };
    setAuditLogs((prev) => [logEntry, ...prev]);

    setSelectedItem(null);
    setIsDepartmentModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteType === "user") {
      setUsers((prev) => prev.filter((user) => user.id !== selectedItem.id));
      addNotification(
        "success",
        `User ${selectedItem.name} deleted successfully`
      );

      // Add audit log
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        user: "Dr. Sarah Johnson",
        userRole: "Admin",
        action: "User Deleted",
        details: `Deleted user: ${selectedItem.name}`,
        category: "User Management",
        severity: "Warning",
      };
      setAuditLogs((prev) => [logEntry, ...prev]);
    } else if (deleteType === "department") {
      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== selectedItem.id)
      );
      addNotification(
        "success",
        `Department ${selectedItem.name} deleted successfully`
      );

      // Add audit log
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        user: "Dr. Sarah Johnson",
        userRole: "Admin",
        action: "Department Deleted",
        details: `Deleted department: ${selectedItem.name}`,
        category: "Department Management",
        severity: "Warning",
      };
      setAuditLogs((prev) => [logEntry, ...prev]);
    }

    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    setDeleteType("");
  };

  const openEditUser = (user) => {
    setSelectedItem(user);
    setIsUserModalOpen(true);
  };

  const openEditDepartment = (department) => {
    setSelectedItem(department);
    setIsDepartmentModalOpen(true);
  };

  const openDeleteModal = (item, type) => {
    setSelectedItem(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 lg:ml-0">
        <TopNavigation setIsSidebarOpen={setIsSidebarOpen} />
        <NotificationList notifications={notifications} />

        <main className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="users"
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>User Management</span>
              </TabsTrigger>
              <TabsTrigger
                value="departments"
                className="flex items-center space-x-2"
              >
                <Building className="h-4 w-4" />
                <span>Department Setup</span>
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Audit Logs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserManagementTab
                users={users}
                openEditUser={openEditUser}
                openDeleteModal={openDeleteModal}
                setIsUserModalOpen={setIsUserModalOpen}
              />
            </TabsContent>

            <TabsContent value="departments">
              <DepartmentSetupTab
                departments={departments}
                openEditDepartment={openEditDepartment}
                openDeleteModal={openDeleteModal}
                setIsDepartmentModalOpen={setIsDepartmentModalOpen}
              />
            </TabsContent>

            <TabsContent value="audit">
              <AuditLogsTab auditLogs={auditLogs} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        setIsOpen={setIsUserModalOpen}
        selectedUser={selectedItem}
        onSave={handleSaveUser}
      />
      <DepartmentModal
        isOpen={isDepartmentModalOpen}
        setIsOpen={setIsDepartmentModalOpen}
        selectedDepartment={selectedItem}
        onSave={handleSaveDepartment}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onDelete={handleDelete}
        item={selectedItem}
        type={deleteType}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;
