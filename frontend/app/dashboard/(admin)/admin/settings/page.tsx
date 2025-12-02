/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Users, Building, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopNavigation from "@/components/admin-components/settings-components/TopNavigation";
import NotificationList from "@/components/admin-components/settings-components/NotificationList";
import UserManagementTab from "@/components/admin-components/settings-components/UserManagementTab";
import DepartmentSetupTab from "@/components/admin-components/settings-components/DepartmentSetupTab";
import AuditLogsTab from "@/components/admin-components/settings-components/AuditLogsTab";
import UserModal from "@/components/ui/modals/UserModal";
import DepartmentModal from "@/components/ui/modals/DepartmentModal";
import DeleteConfirmationModal from "@/components/ui/modals/DeleteConfirmationModal";
import { createNewUser, deleteUser, fetchAllUsers } from "@/api/api";
import { CreateUserPayload, User } from "@/api/types";

const SettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<User | null>(null);
  const [deleteType, setDeleteType] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

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

  const addNotification = (type: string, message: string) => {
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

  // Fetch Users Logic
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      addNotification(
        "error",
        error.message || "Failed to load user list. Check API server status."
      );
      setUsers([]); // Clear users on error
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (userForm: any) => {
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

      // Add audit log
      const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        user: "Dr. Sarah Johnson",
        userRole: "Admin",
        action: selectedItem ? "User Updated" : "User Created",
        details: `${selectedItem ? "Updated" : "Created"} user: ${
          userForm.name
        }`,
        category: "User Management",
        severity: "Info",
      };
      setAuditLogs((prev) => [logEntry, ...prev]);
    } else {
      if (!userForm.password) {
        addNotification("error", "Password is required to create a new user.");
        return;
      }

      const payload: CreateUserPayload = {
        name: userForm.name,
        email: userForm.email,
        // The modal should provide uppercase roles, but we ensure it here just in case.
        role: userForm.role.toUpperCase() as CreateUserPayload["role"],
        password: userForm.password,
        specialty: userForm.specialty || null,
        avatarUrl: userForm.avatarUrl || null,
      };

      try {
        const newUser = await createNewUser(payload);

        // Update local state with the user object returned from the API
        setUsers((prev) => [...prev, newUser]);
        addNotification("success", `User ${newUser.name} created successfully`);

        // Add audit log for creation (Mock)
        const logEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          user: "Dr. Sarah Johnson",
          userRole: "Admin",
          action: "User Created",
          details: `Created new user: ${newUser.name} (${newUser.email})`,
          category: "User Management",
          severity: "Info",
        };
        setAuditLogs((prev) => [logEntry, ...prev]);
      } catch (error: any) {
        console.error("Error creating user:", error);
        addNotification("error", error.message || "Failed to create user.");
        // Stop execution on API failure
        return;
      }
    }

    setSelectedItem(null);
    setIsUserModalOpen(false);
  };

  const handleSaveDepartment = (departmentForm: any) => {
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

  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.id) return;

    if (deleteType === "user") {
      try {
        await deleteUser(selectedItem.id);

        // On success, update UI state
        setUsers((prev) => prev.filter((user) => user.id !== selectedItem.id));
        addNotification(
          "success",
          `User ${selectedItem.name} deleted successfully`
        );

        // Add audit log (Mock locally)
        const logEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          user: "Dr. Sarah Johnson", // Mock current user
          userRole: "Admin",
          action: "User Deleted",
          details: `Deleted user: ${selectedItem.name}`,
          category: "User Management",
          severity: "Warning",
        };
        setAuditLogs((prev) => [logEntry, ...prev]);
      } catch (error: any) {
        console.error("Error deleting user:", error);
        addNotification("error", error.message || "Failed to delete user.");
        // We still need to clear the modal state, but stop further processing
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        setDeleteType("");
        return;
      }
    } else if (deleteType === "department") {
      // Existing mock department deletion (no API integration here yet)
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

  const handleUserModalChange = (open: boolean) => {
    setIsUserModalOpen(open); // When the dialog is closing (open is false), reset selectedItem to prevent stale data
    if (!open) {
      setSelectedItem(null);
    }
  };

  const openEditUser = (user: User) => {
    setSelectedItem(user);
    setIsUserModalOpen(true);
  };

  const openEditDepartment = (department: any) => {
    setSelectedItem(department);
    setIsDepartmentModalOpen(true);
  };

  const openDeleteModal = (item: any, type: string) => {
    setSelectedItem(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 lg:ml-0">
        <TopNavigation />
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
                // setIsUserModalOpen={setIsUserModalOpen}
                setIsUserModalOpen={() => {
                  setSelectedItem(null);
                  setIsUserModalOpen(true);
                }}
                isLoadingUsers={isLoadingUsers}
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
      {/* <DepartmentModal
        isOpen={isDepartmentModalOpen}
        setIsOpen={setIsDepartmentModalOpen}
        selectedDepartment={selectedItem}
        onSave={handleSaveDepartment}
      /> */}
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
