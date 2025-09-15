/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SchedulerHeader } from "@/components/admin-components/scheduler-components/SchedulerHeader";
import { ScheduleCalendar } from "@/components/admin-components/scheduler-components/ScheduleCalendar";
import { AvailableStaffCard } from "@/components/admin-components/scheduler-components/AvailableStaffCard";
import { LegendCard } from "@/components/admin-components/scheduler-components/LegendCard";

interface Staff {
  id: number;
  name: string;
  role: string;
  availability: string;
  department: string;
  status: string;
}

interface Shift {
  id: number;
  staffName: string;
  staffRole: string;
  department: string;
  startTime: string;
  endTime: string;
  date: string;
  color: string;
}

const StaffSchedulerPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [draggedStaff, setDraggedStaff] = useState<Staff | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);

  // Mock data
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 1,
      staffName: "Dr. John Smith",
      staffRole: "Doctor",
      department: "Emergency",
      startTime: "08:00",
      endTime: "16:00",
      date: "2025-01-06",
      color: "bg-blue-500",
    },
    {
      id: 2,
      staffName: "Nurse Jane Doe",
      staffRole: "Nurse",
      department: "Pediatrics",
      startTime: "16:00",
      endTime: "00:00",
      date: "2025-01-06",
      color: "bg-green-500",
    },
    {
      id: 3,
      staffName: "Dr. Alice Johnson",
      staffRole: "Doctor",
      department: "ICU",
      startTime: "00:00",
      endTime: "08:00",
      date: "2025-01-07",
      color: "bg-blue-500",
    },
  ]);

  const [availableStaff, setAvailableStaff] = useState<Staff[]>([
    {
      id: 1,
      name: "Dr. Alice Johnson",
      role: "Doctor",
      availability: "08:00 - 16:00",
      department: "Emergency",
      status: "Available",
    },
    {
      id: 2,
      name: "Nurse Ben Wilson",
      role: "Nurse",
      availability: "16:00 - 00:00",
      department: "Pediatrics",
      status: "Available",
    },
    {
      id: 3,
      name: "Dr. Sarah Chen",
      role: "Doctor",
      availability: "00:00 - 08:00",
      department: "ICU",
      status: "On Leave",
    },
    {
      id: 4,
      name: "Nurse Mike Davis",
      role: "Nurse",
      availability: "08:00 - 16:00",
      department: "Emergency",
      status: "Available",
    },
  ]);

  const [templateForm, setTemplateForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    role: "",
    department: "",
  });

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleDragStart = (e: React.DragEvent, staff: Staff) => {
    setDraggedStaff(staff);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, date: Date, timeSlot: string) => {
    e.preventDefault();
    if (!draggedStaff) return;

    const existingShift = shifts.find(
      (shift) =>
        shift.date === formatDate(date) &&
        shift.startTime === timeSlot &&
        shift.staffName === draggedStaff.name
    );

    if (existingShift) {
      addNotification(
        "error",
        `Conflict: ${draggedStaff.name} already assigned at this time`
      );
      setDraggedStaff(null);
      return;
    }

    const newShift = {
      id: Date.now(),
      staffName: draggedStaff.name,
      staffRole: draggedStaff.role,
      department: draggedStaff.department,
      startTime: timeSlot,
      endTime: getEndTime(timeSlot),
      date: formatDate(date),
      color: draggedStaff.role === "Doctor" ? "bg-blue-500" : "bg-green-500",
    };

    setShifts((prev) => [...prev, newShift]);
    addNotification(
      "success",
      `Shift assigned: ${draggedStaff.name} to ${draggedStaff.department}`
    );
    setDraggedStaff(null);
  };

  const getEndTime = (startTime: string) => {
    const [hours] = startTime.split(":");
    const endHour = (parseInt(hours) + 8) % 24;
    return `${endHour.toString().padStart(2, "0")}:00`;
  };

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

  const handleAutoAssign = () => {
    setIsAutoAssigning(true);
    addNotification("info", "Running auto-assignment algorithm...");

    setTimeout(() => {
      const autoAssignedShifts = [
        {
          id: Date.now() + 1,
          staffName: "Dr. Alice Johnson",
          staffRole: "Doctor",
          department: "Emergency",
          startTime: "08:00",
          endTime: "16:00",
          date: formatDate(getWeekDates(currentWeek)[1]),
          color: "bg-blue-500",
        },
        {
          id: Date.now() + 2,
          staffName: "Nurse Ben Wilson",
          staffRole: "Nurse",
          department: "Pediatrics",
          startTime: "16:00",
          endTime: "00:00",
          date: formatDate(getWeekDates(currentWeek)[1]),
          color: "bg-green-500",
        },
      ];

      setShifts((prev) => [...prev, ...autoAssignedShifts]);
      addNotification(
        "success",
        `Auto-assigned ${autoAssignedShifts.length} shifts successfully`
      );
      setIsAutoAssigning(false);
    }, 2000);
  };

  const handleSaveTemplate = () => {
    if (
      !templateForm.name ||
      !templateForm.startTime ||
      !templateForm.endTime ||
      !templateForm.role
    ) {
      addNotification("error", "Please fill in all required fields");
      return;
    }

    addNotification(
      "success",
      `Template "${templateForm.name}" saved successfully`
    );
    setTemplateForm({
      name: "",
      startTime: "",
      endTime: "",
      role: "",
      department: "",
    });
    setIsTemplateModalOpen(false);
  };

  const navigateWeek = (direction: number) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  return (
    <div className="flex-1 lg:ml-0">
      <SchedulerHeader
        onAutoAssign={handleAutoAssign}
        isAutoAssigning={isAutoAssigning}
        onSaveTemplate={handleSaveTemplate}
        isTemplateModalOpen={isTemplateModalOpen}
        setIsTemplateModalOpen={setIsTemplateModalOpen}
        templateForm={templateForm}
        setTemplateForm={setTemplateForm}
      />
      {notifications.length > 0 && (
        <div className="p-4 space-y-2">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              variant={
                notification.type === "error" ? "destructive" : "default"
              }
            >
              <AlertDescription className="flex items-center justify-between">
                <span>{notification.message}</span>
                <span className="text-xs text-gray-500">
                  {notification.timestamp}
                </span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
      <main className="p-2">
        <div className="grid lg:grid-cols-4 gap-2">
          <div className="lg:col-span-3">
            <ScheduleCalendar
              currentWeek={currentWeek}
              shifts={shifts}
              navigateWeek={navigateWeek}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
            />
          </div>
          <div className="lg:col-span-1">
            <AvailableStaffCard
              availableStaff={availableStaff}
              handleDragStart={handleDragStart}
            />
            <LegendCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffSchedulerPage;
