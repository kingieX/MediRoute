"use client";

import { useState } from "react";
import Header from "@/components/admin-components/reports-components/Header";
import NotificationList from "@/components/admin-components/reports-components/NotificationList";
import KeyMetrics from "@/components/admin-components/reports-components/KeyMetrics";
import ChartsSection from "@/components/admin-components/reports-components/ChartsSection";
import StaffDistribution from "@/components/admin-components/reports-components/StaffDistribution";
import ExportReports from "@/components/admin-components/reports-components/ExportReports";
import { AnalyticsData, Notification } from "@/api/types";

const initialAnalyticsData: AnalyticsData = {
  staffUtilization: [
    { time: "00:00", doctors: 12, nurses: 18, total: 30 },
    { time: "04:00", doctors: 8, nurses: 12, total: 20 },
    { time: "08:00", doctors: 20, nurses: 25, total: 45 },
    { time: "12:00", doctors: 22, nurses: 28, total: 50 },
    { time: "16:00", doctors: 18, nurses: 22, total: 40 },
    { time: "20:00", doctors: 15, nurses: 20, total: 35 },
  ],
  patientCongestion: [
    { department: "Emergency", current: 35, capacity: 50, percentage: 70 },
    { department: "ICU", current: 18, capacity: 20, percentage: 90 },
    { department: "Pediatrics", current: 25, capacity: 40, percentage: 62 },
    { department: "Surgery", current: 15, capacity: 30, percentage: 50 },
  ],
  staffDistribution: [
    { role: "Doctors", count: 45, percentage: 35 },
    { role: "Nurses", count: 68, percentage: 53 },
    { role: "Administrators", count: 15, percentage: 12 },
  ],
  keyMetrics: {
    avgWaitTime: 18,
    staffEfficiency: 87,
    patientThroughput: 142,
    alertsResolved: 23,
  },
};

const AnalyticsReportsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("7days");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analyticsData, setAnalyticsData] =
    useState<AnalyticsData>(initialAnalyticsData);

  const addNotification = (
    type: "success" | "info" | "error",
    message: string
  ) => {
    const notification: Notification = {
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnalyticsData((prev) => ({
      ...prev,
      staffUtilization: prev.staffUtilization.map((item) => ({
        ...item,
        doctors: Math.max(5, item.doctors + Math.floor(Math.random() * 6) - 3),
        nurses: Math.max(8, item.nurses + Math.floor(Math.random() * 6) - 3),
      })),
      keyMetrics: {
        ...prev.keyMetrics,
        avgWaitTime: Math.max(
          10,
          prev.keyMetrics.avgWaitTime + Math.floor(Math.random() * 6) - 3
        ),
        staffEfficiency: Math.max(
          70,
          Math.min(
            100,
            prev.keyMetrics.staffEfficiency + Math.floor(Math.random() * 6) - 3
          )
        ),
      },
    }));
    addNotification("success", "Analytics data refreshed successfully");
    setIsRefreshing(false);
  };

  const handleExportPDF = async () => {
    addNotification("info", "Generating PDF report...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    addNotification("success", "PDF report exported successfully");
  };

  const handleExportCSV = async () => {
    addNotification("info", "Generating CSV report...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    addNotification("success", "CSV report exported successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 lg:ml-0">
        <Header
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          handleRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <NotificationList notifications={notifications} />
        <main className="p-6">
          <KeyMetrics keyMetrics={analyticsData.keyMetrics} />
          <ChartsSection
            staffUtilization={analyticsData.staffUtilization}
            patientCongestion={analyticsData.patientCongestion}
          />
          <div className="grid lg:grid-cols-3 gap-6">
            <StaffDistribution
              staffDistribution={analyticsData.staffDistribution}
            />
            <ExportReports
              handleExportPDF={handleExportPDF}
              handleExportCSV={handleExportCSV}
            />
          </div>
        </main>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AnalyticsReportsPage;
