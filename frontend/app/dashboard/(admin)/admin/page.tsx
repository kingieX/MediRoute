/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/admin-components/dashboard-components/Header";
import { StatCards } from "@/components/admin-components/dashboard-components/StatCards";
import { QuickAccess } from "@/components/admin-components/dashboard-components/QuickAccess";
import {
  getAlerts,
  getAllShifts,
  getDepartmentsWithCount,
  getWaitingPatients,
} from "@/api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    patientsWaiting: 0,
    activeAlerts: 0,
    overCapacityDepts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch and count total staff on duty
        const shifts = await getAllShifts();
        const uniqueStaffIds = new Set(shifts.map((shift) => shift.user.id));

        // Fetch and count waiting patients
        const waitingPatients = await getWaitingPatients();

        // fetch and count unread alerts
        const unReadAlerts = await getAlerts();

        // Fetch departments and count over-capacity ones
        const departments = await getDepartmentsWithCount();
        const overCapacity = departments.filter(
          (dept) => dept._count.patients > dept.capacity
        ).length;

        setStats((prev) => ({
          ...prev,
          totalStaff: uniqueStaffIds.size,
          patientsWaiting: waitingPatients.length,
          activeAlerts: unReadAlerts.length,
          overCapacityDepts: overCapacity,
        }));
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        patientsWaiting: Math.max(
          0,
          prev.patientsWaiting + Math.floor(Math.random() * 3) - 1
        ),
        activeAlerts: Math.max(
          0,
          prev.activeAlerts + Math.floor(Math.random() * 2) - 1
        ),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation Component */}
        <Header stats={stats} />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards Component */}
          <StatCards stats={stats} />

          {/* Quick Access Component */}
          <QuickAccess />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
