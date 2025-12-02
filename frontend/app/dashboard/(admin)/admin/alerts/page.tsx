"use client";

import { useState, useEffect } from "react";
import Header from "@/components/admin-components/alerts-components/Header";
import OverviewStats from "@/components/admin-components/alerts-components/OverviewStats";
import AlertTabs from "@/components/admin-components/alerts-components/AlertTabs";
import NotificationList from "@/components/admin-components/alerts-components/NotificationList";

const AlertsNotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      type: "critical",
      severity: "Critical",
      message: "Emergency Department critically understaffed",
      department: "Emergency",
      timestamp: "10:05",
      fullTime: "2 hours ago",
      description: "Only 2 doctors available, minimum required is 4",
      status: "Active",
    },
    {
      id: 2,
      type: "warning",
      severity: "High",
      message: "Pediatrics department nearing capacity",
      department: "Pediatrics",
      timestamp: "10:20",
      fullTime: "1 hour 45 minutes ago",
      description: "Current capacity at 85%, threshold is 80%",
      status: "Active",
    },
    {
      id: 3,
      type: "info",
      severity: "Medium",
      message: "ICU equipment maintenance scheduled",
      department: "ICU",
      timestamp: "09:45",
      fullTime: "2 hours 20 minutes ago",
      description: "Ventilator maintenance scheduled for 14:00",
      status: "Acknowledged",
    },
    {
      id: 4,
      type: "warning",
      severity: "High",
      message: "Surgery department overtime threshold exceeded",
      department: "Surgery",
      timestamp: "11:30",
      fullTime: "45 minutes ago",
      description: "Staff working 12+ hours, consider shift rotation",
      status: "Active",
    },
  ]);
  const [alertHistory, setAlertHistory] = useState([
    {
      id: 1,
      time: "09:00",
      fullTime: "2025-01-06 09:00:00",
      department: "ICU",
      message: "ICU Department overloaded",
      severity: "Critical",
      status: "Resolved",
      resolvedBy: "Dr. Sarah Johnson",
      duration: "45 minutes",
    },
    {
      id: 2,
      time: "08:30",
      fullTime: "2025-01-06 08:30:00",
      department: "Emergency",
      message: "Emergency Department understaffed",
      severity: "High",
      status: "Resolved",
      resolvedBy: "Admin System",
      duration: "1 hour 15 minutes",
    },
    {
      id: 3,
      time: "07:45",
      fullTime: "2025-01-06 07:45:00",
      department: "Pediatrics",
      message: "Patient wait time exceeded threshold",
      severity: "Medium",
      status: "Resolved",
      resolvedBy: "Nurse Manager",
      duration: "30 minutes",
    },
    {
      id: 4,
      time: "06:20",
      fullTime: "2025-01-06 06:20:00",
      department: "Surgery",
      message: "Operating room equipment malfunction",
      severity: "Critical",
      status: "Resolved",
      resolvedBy: "Maintenance Team",
      duration: "2 hours 10 minutes",
    },
  ]);
  const [thresholds, setThresholds] = useState([
    {
      id: 1,
      department: "Emergency",
      maxPatients: 50,
      minStaff: 4,
      maxWaitTime: 30,
      lastUpdated: "2025-01-06",
    },
    {
      id: 2,
      department: "ICU",
      maxPatients: 20,
      minStaff: 3,
      maxWaitTime: 15,
      lastUpdated: "2025-01-06",
    },
    {
      id: 3,
      department: "Pediatrics",
      maxPatients: 40,
      minStaff: 2,
      maxWaitTime: 20,
      lastUpdated: "2025-01-05",
    },
    {
      id: 4,
      department: "Surgery",
      maxPatients: 30,
      minStaff: 5,
      maxWaitTime: 60,
      lastUpdated: "2025-01-06",
    },
  ]);
  const [configForm, setConfigForm] = useState({
    department: "",
    maxPatients: "",
    minStaff: "",
    maxWaitTime: "",
  });

  // Helper functions remain in the parent component as they rely on its state
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

  const handleAcknowledgeAlert = (alertId: number) => {
    setActiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "Acknowledged" } : alert
      )
    );
    addNotification("success", "Alert acknowledged successfully");
  };

  const handleResolveAlert = (alertId: number) => {
    const alert = activeAlerts.find((a) => a.id === alertId);
    if (alert) {
      const historyEntry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString().slice(0, 5),
        fullTime: new Date().toISOString(),
        department: alert.department,
        message: alert.message,
        severity: alert.severity,
        status: "Resolved",
        resolvedBy: "Dr. Sarah Johnson",
        duration: "Just resolved",
      };
      setAlertHistory((prev) => [historyEntry, ...prev]);
      setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
      addNotification("success", "Alert resolved and moved to history");
    }
  };

  const handleSaveThreshold = () => {
    if (
      !configForm.department ||
      !configForm.maxPatients ||
      !configForm.minStaff
    ) {
      addNotification("error", "Please fill in all required fields");
      return;
    }
    const newThreshold = {
      id: Date.now(),
      department: configForm.department,
      maxPatients: parseInt(configForm.maxPatients),
      minStaff: parseInt(configForm.minStaff),
      maxWaitTime: parseInt(configForm.maxWaitTime) || 30,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    const existingIndex = thresholds.findIndex(
      (t) => t.department === configForm.department
    );
    if (existingIndex >= 0) {
      setThresholds((prev) =>
        prev.map((t, i) => (i === existingIndex ? newThreshold : t))
      );
      addNotification(
        "success",
        `Threshold updated for ${configForm.department}`
      );
    } else {
      setThresholds((prev) => [...prev, newThreshold]);
      addNotification(
        "success",
        `New threshold created for ${configForm.department}`
      );
    }
    setConfigForm({
      department: "",
      maxPatients: "",
      minStaff: "",
      maxWaitTime: "",
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addNotification("success", "Alerts data refreshed successfully");
    setIsRefreshing(false);
  };

  // Memoized filtered data
  const filteredActiveAlerts = activeAlerts.filter((alert) => {
    const matchesDepartment =
      selectedDepartment === "All" || alert.department === selectedDepartment;
    const matchesSeverity =
      selectedSeverity === "All" || alert.severity === selectedSeverity;
    const matchesSearch =
      searchTerm === "" ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSeverity && matchesSearch;
  });

  const filteredHistory = alertHistory.filter((alert) => {
    const matchesDepartment =
      selectedDepartment === "All" || alert.department === selectedDepartment;
    const matchesSearch =
      searchTerm === "" ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const criticalAlerts = activeAlerts.filter(
    (a) => a.severity === "Critical"
  ).length;
  const totalActiveAlerts = activeAlerts.filter(
    (a) => a.status === "Active"
  ).length;
  const acknowledgedAlerts = activeAlerts.filter(
    (a) => a.status === "Acknowledged"
  ).length;
  const resolvedToday = alertHistory.filter((a) =>
    a.fullTime.includes("2025-01-06")
  ).length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const newAlert = {
          id: Date.now(),
          type: "warning",
          severity: "Medium",
          message: "New patient admitted to Emergency",
          department: "Emergency",
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          fullTime: "Just now",
          description: "Patient queue updated",
          status: "Active",
        };
        setActiveAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
        addNotification("info", "New alert: " + newAlert.message);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 lg:ml-0">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          handleRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <NotificationList notifications={notifications} />
        <main className="p-6">
          <OverviewStats
            criticalAlerts={criticalAlerts}
            totalActiveAlerts={totalActiveAlerts}
            acknowledgedAlerts={acknowledgedAlerts}
            resolvedToday={resolvedToday}
          />
          <AlertTabs
            selectedSeverity={selectedSeverity}
            setSelectedSeverity={setSelectedSeverity}
            filteredActiveAlerts={filteredActiveAlerts}
            filteredHistory={filteredHistory}
            handleAcknowledgeAlert={handleAcknowledgeAlert}
            handleResolveAlert={handleResolveAlert}
            thresholds={thresholds}
            configForm={configForm}
            setConfigForm={setConfigForm}
            handleSaveThreshold={handleSaveThreshold}
          />
        </main>
      </div>
    </div>
  );
};

export default AlertsNotificationsPage;
