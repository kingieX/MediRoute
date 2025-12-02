/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/admin-components/map-components/Header";
import { MapSection } from "@/components/admin-components/map-components/MapSection";
import { Legend } from "@/components/admin-components/map-components/Legend";
import { LiveStats } from "@/components/admin-components/map-components/LiveStats";
import { FloorNavigation } from "@/components/admin-components/map-components/FloorNavigation";
import { Notifications } from "@/components/Notifications";

const HospitalMapPage = () => {
  const [selectedFloor, setSelectedFloor] = useState("Ground Floor");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [mapData, setMapData] = useState({
    staff: [
      {
        id: 1,
        name: "Dr. John Smith",
        role: "Doctor",
        department: "Emergency",
        position: { x: 25, y: 30 },
        lastUpdate: "2s ago",
        status: "Active",
      },
      {
        id: 2,
        name: "Nurse Jane Doe",
        role: "Nurse",
        department: "ICU",
        position: { x: 60, y: 45 },
        lastUpdate: "5s ago",
        status: "Active",
      },
      {
        id: 3,
        name: "Dr. Alice Johnson",
        role: "Doctor",
        department: "Pediatrics",
        position: { x: 40, y: 70 },
        lastUpdate: "1s ago",
        status: "Active",
      },
      {
        id: 4,
        name: "Nurse Mike Wilson",
        role: "Nurse",
        department: "Surgery",
        position: { x: 75, y: 25 },
        lastUpdate: "8s ago",
        status: "Break",
      },
    ],
    patients: [
      {
        id: 1,
        name: "Patient A",
        status: "Waiting",
        department: "Emergency",
        position: { x: 30, y: 35 },
        lastUpdate: "3s ago",
        priority: "High",
      },
      {
        id: 2,
        name: "Patient B",
        status: "In Treatment",
        department: "ICU",
        position: { x: 65, y: 50 },
        lastUpdate: "1s ago",
        priority: "Critical",
      },
      {
        id: 3,
        name: "Patient C",
        status: "Waiting",
        department: "Pediatrics",
        position: { x: 45, y: 75 },
        lastUpdate: "6s ago",
        priority: "Medium",
      },
    ],
    rooms: [
      {
        id: 1,
        name: "ER-101",
        type: "Emergency",
        position: { x: 20, y: 25 },
        occupied: true,
      },
      {
        id: 2,
        name: "ER-102",
        type: "Emergency",
        position: { x: 35, y: 25 },
        occupied: false,
      },
      {
        id: 3,
        name: "ICU-201",
        type: "ICU",
        position: { x: 55, y: 40 },
        occupied: true,
      },
      {
        id: 4,
        name: "ICU-202",
        type: "ICU",
        position: { x: 70, y: 40 },
        occupied: true,
      },
      {
        id: 5,
        name: "PED-301",
        type: "Pediatrics",
        position: { x: 35, y: 65 },
        occupied: true,
      },
      {
        id: 6,
        name: "OR-401",
        type: "Surgery",
        position: { x: 70, y: 20 },
        occupied: false,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMapData((prev) => ({
        ...prev,
        staff: prev.staff.map((staff) => ({
          ...staff,
          position: {
            x: Math.max(
              10,
              Math.min(90, staff.position.x + (Math.random() - 0.5) * 2)
            ),
            y: Math.max(
              10,
              Math.min(90, staff.position.y + (Math.random() - 0.5) * 2)
            ),
          },
          lastUpdate: `${Math.floor(Math.random() * 10) + 1}s ago`,
        })),
        patients: prev.patients.map((patient) => ({
          ...patient,
          lastUpdate: `${Math.floor(Math.random() * 15) + 1}s ago`,
        })),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addNotification("success", "Map data refreshed successfully");
    setIsRefreshing(false);
  };

  const filteredStaff =
    selectedFilter === "All"
      ? mapData.staff
      : mapData.staff.filter((staff) => staff.role === selectedFilter);

  const filteredPatients =
    selectedFilter === "All" ||
    selectedFilter === "Doctor" ||
    selectedFilter === "Nurse"
      ? mapData.patients
      : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 lg:ml-0">
        <Header
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          handleRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <Notifications notifications={notifications} />
        <main className="p-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <MapSection
              selectedFloor={selectedFloor}
              filteredStaff={filteredStaff}
              filteredPatients={filteredPatients as any}
              rooms={mapData.rooms}
            />
            <div className="lg:col-span-1 space-y-6">
              <Legend />
              <LiveStats
                staffData={mapData.staff}
                patientData={mapData.patients}
                roomData={mapData.rooms}
              />
              <FloorNavigation
                selectedFloor={selectedFloor}
                setSelectedFloor={setSelectedFloor}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalMapPage;
