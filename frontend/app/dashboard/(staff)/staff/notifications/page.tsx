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
  AlertTriangle,
  Info,
  CheckCircle,
  Trash2,
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

const NotificationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "shift",
      title: "Shift reassigned to ER at 08:00",
      message:
        "Your shift for tomorrow has been moved from Pediatrics to Emergency Room.",
      timestamp: "08:45",
      fullTime: "2 hours ago",
      read: false,
      priority: "medium",
    },
    {
      id: 2,
      type: "alert",
      title: "Department Pediatrics reaching capacity",
      message:
        "Pediatrics department is at 85% capacity. Consider patient redistribution.",
      timestamp: "09:10",
      fullTime: "1 hour ago",
      read: false,
      priority: "high",
    },
    {
      id: 3,
      type: "patient",
      title: 'New patient "Peter Jones" added to queue',
      message: "High priority patient assigned to your care in Emergency Room.",
      timestamp: "09:15",
      fullTime: "45 minutes ago",
      read: false,
      priority: "high",
    },
    {
      id: 4,
      type: "system",
      title: "System maintenance scheduled",
      message:
        "MediRoute will undergo maintenance tonight from 2:00 AM to 4:00 AM.",
      timestamp: "07:30",
      fullTime: "3 hours ago",
      read: true,
      priority: "low",
    },
    {
      id: 5,
      type: "shift",
      title: "Overtime opportunity available",
      message:
        "Extra shift available in ICU this weekend. Contact supervisor if interested.",
      timestamp: "06:45",
      fullTime: "4 hours ago",
      read: true,
      priority: "low",
    },
  ]);

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
      active: false,
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/dashboard/staff/notifications",
      active: true,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "shift":
        return <Calendar className="h-5 w-5" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5" />;
      case "patient":
        return <Users className="h-5 w-5" />;
      case "system":
        return <Info className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === "high") return "text-red-600 bg-red-100";
    if (priority === "medium") return "text-yellow-600 bg-yellow-100";

    switch (type) {
      case "shift":
        return "text-blue-600 bg-blue-100";
      case "alert":
        return "text-red-600 bg-red-100";
      case "patient":
        return "text-green-600 bg-green-100";
      case "system":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
                Notifications
              </h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {unreadCount} unread
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">
                Stay updated with important alerts, shift changes, and system
                notifications.
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                All Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No notifications at this time
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        notification.read
                          ? "bg-white border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div
                            className={`p-2 rounded-full ${getNotificationColor(
                              notification.type,
                              notification.priority
                            )}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4
                                className={`font-semibold ${
                                  notification.read
                                    ? "text-gray-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {getPriorityBadge(notification.priority)}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{notification.fullTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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

export default NotificationsPage;
