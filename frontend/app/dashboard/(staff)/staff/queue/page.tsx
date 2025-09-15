"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Users,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Stethoscope,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PatientQueuePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      status: "Waiting",
      waitTime: "10 min",
      assignedTo: "Dr. Ellis",
      priority: "High",
      room: "ER-101",
    },
    {
      id: 2,
      name: "Jane Smith",
      status: "In Consultation",
      waitTime: "—",
      assignedTo: "Nurse Miller",
      priority: "Medium",
      room: "ER-102",
    },
    {
      id: 3,
      name: "Peter Jones",
      status: "Waiting",
      waitTime: "25 min",
      assignedTo: "Unassigned",
      priority: "Low",
      room: "ER-103",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      status: "Ready for Discharge",
      waitTime: "—",
      assignedTo: "Dr. Chen",
      priority: "Low",
      room: "ER-104",
    },
    {
      id: 5,
      name: "Michael Brown",
      status: "Waiting",
      waitTime: "5 min",
      assignedTo: "Dr. Chen",
      priority: "High",
      room: "ER-105",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients((prev) =>
        prev.map((patient) => {
          if (patient.status === "Waiting" && patient.waitTime !== "—") {
            const currentWait = parseInt(patient.waitTime);
            return {
              ...patient,
              waitTime: `${currentWait + 1} min`,
            };
          }
          return patient;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const sidebarItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard/staff", active: false },
    {
      label: "My Shifts",
      icon: Calendar,
      path: "/dashboard/staff/shifts",
      active: false,
    },
    {
      label: "Patient Queue",
      icon: Users,
      path: "/dashboard/staff/queue",
      active: true,
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/dashboard/staff/notifications",
      active: false,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting":
        return "bg-yellow-100 text-yellow-800";
      case "In Consultation":
        return "bg-blue-100 text-blue-800";
      case "Ready for Discharge":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High":
        return <AlertCircle className="h-4 w-4" />;
      case "Medium":
        return <Clock className="h-4 w-4" />;
      case "Low":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MediRoute</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : ""
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Dr. Emily Chen
                  </div>
                  <div className="text-xs text-gray-500">
                    Emergency Medicine
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Patient Queue
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      Dr. Emily Chen
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Emergency Room Queue
            </h2>
            <p className="text-gray-600">
              Monitor and manage patient flow in the Emergency Room. Click on
              any patient for detailed information.
            </p>
          </div>

          {/* Queue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {patients.filter((p) => p.status === "Waiting").length}
                </div>
                <div className="text-sm text-gray-600">Waiting</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {
                    patients.filter((p) => p.status === "In Consultation")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">In Consultation</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {
                    patients.filter((p) => p.status === "Ready for Discharge")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Ready for Discharge</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {patients.filter((p) => p.priority === "High").length}
                </div>
                <div className="text-sm text-gray-600">High Priority</div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Queue Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Current Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Patient Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Room
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Wait Time
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Assigned To
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {patient.name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {patient.room}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(patient.priority)}
                            <Badge
                              className={getPriorityColor(patient.priority)}
                            >
                              {patient.priority}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {patient.waitTime}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {patient.assignedTo}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientQueuePage;
