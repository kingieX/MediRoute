/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/admin-components/patient-flow/Header";
import { StatsGrid } from "@/components/admin-components/patient-flow/StatsGrid";
import { PatientList } from "@/components/admin-components/patient-flow/PatientList";
import { ReroutePatientModal } from "@/components/admin-components/patient-flow/ReroutePatientModal";

const PatientFlowManagerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Emergency",
      status: "Overloaded",
      loadIndicator: "red",
      capacity: 85,
      maxCapacity: 50,
      patients: [
        {
          id: 1,
          name: "John Doe",
          status: "Waiting",
          waitTime: "15 min",
          priority: "High",
          admissionTime: "08:30",
        },
        {
          id: 2,
          name: "Jane Smith",
          status: "In Treatment",
          waitTime: "—",
          priority: "Medium",
          admissionTime: "09:15",
        },
        {
          id: 3,
          name: "Mike Johnson",
          status: "Waiting",
          waitTime: "22 min",
          priority: "High",
          admissionTime: "08:45",
        },
        {
          id: 4,
          name: "Sarah Wilson",
          status: "Ready for Discharge",
          waitTime: "—",
          priority: "Low",
          admissionTime: "07:30",
        },
      ],
    },
    {
      id: 2,
      name: "Pediatrics",
      status: "Normal",
      loadIndicator: "green",
      capacity: 30,
      maxCapacity: 40,
      patients: [
        {
          id: 5,
          name: "Alice Brown",
          status: "Waiting",
          waitTime: "5 min",
          priority: "Medium",
          admissionTime: "09:45",
        },
        {
          id: 6,
          name: "Tommy Lee",
          status: "In Treatment",
          waitTime: "—",
          priority: "Low",
          admissionTime: "09:00",
        },
      ],
    },
    {
      id: 3,
      name: "ICU",
      status: "Near Capacity",
      loadIndicator: "yellow",
      capacity: 75,
      maxCapacity: 20,
      patients: [
        {
          id: 7,
          name: "Robert Davis",
          status: "Critical Care",
          waitTime: "—",
          priority: "Critical",
          admissionTime: "06:00",
        },
        {
          id: 8,
          name: "Maria Garcia",
          status: "Monitoring",
          waitTime: "—",
          priority: "High",
          admissionTime: "07:15",
        },
        {
          id: 9,
          name: "David Chen",
          status: "Waiting",
          waitTime: "8 min",
          priority: "Medium",
          admissionTime: "09:30",
        },
      ],
    },
    {
      id: 4,
      name: "Surgery",
      status: "Normal",
      loadIndicator: "green",
      capacity: 45,
      maxCapacity: 30,
      patients: [
        {
          id: 10,
          name: "Lisa Anderson",
          status: "Pre-Op",
          waitTime: "—",
          priority: "Medium",
          admissionTime: "08:00",
        },
        {
          id: 11,
          name: "James Wilson",
          status: "Post-Op Recovery",
          waitTime: "—",
          priority: "Low",
          admissionTime: "06:30",
        },
      ],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDepartments((prev) =>
        prev.map((dept) => ({
          ...dept,
          patients: dept.patients.map((patient) => {
            if (patient.status === "Waiting" && patient.waitTime !== "—") {
              const currentWait = parseInt(patient.waitTime);
              return {
                ...patient,
                waitTime: `${currentWait + 1} min`,
              };
            }
            return patient;
          }),
        }))
      );
    }, 60000);

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

  const handleReroute = (patientName: string, targetDeptName: string) => {
    if (!patientName || !targetDeptName) {
      addNotification(
        "error",
        "Please select both patient and target department"
      );
      return;
    }

    const sourcePatient = departments
      .flatMap((dept) => dept.patients)
      .find((patient) => patient.name === patientName);

    if (!sourcePatient) {
      addNotification("error", "Patient not found");
      return;
    }

    const targetDept = departments.find((dept) => dept.name === targetDeptName);
    if (targetDept && targetDept.capacity >= 90) {
      addNotification("error", `${targetDeptName} department is at capacity`);
      return;
    }

    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.patients.some((p) => p.name === patientName)) {
          return {
            ...dept,
            patients: dept.patients.filter((p) => p.name !== patientName),
            capacity: Math.max(0, dept.capacity - 10),
          };
        }
        if (dept.name === targetDeptName) {
          return {
            ...dept,
            patients: [
              ...dept.patients,
              { ...sourcePatient, status: "Waiting", waitTime: "0 min" },
            ],
            capacity: Math.min(100, dept.capacity + 10),
          };
        }
        return dept;
      })
    );

    addNotification(
      "success",
      `Patient ${patientName} successfully rerouted to ${targetDeptName}`
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addNotification("success", "Patient data refreshed successfully");
    setIsRefreshing(false);
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesDepartment =
      selectedDepartment === "All" || dept.name === selectedDepartment;
    const matchesSearch =
      searchTerm === "" ||
      dept.patients.some((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesDepartment && matchesSearch;
  });

  const allPatients = departments.flatMap((dept) => dept.patients);
  const totalPatients = allPatients.length;
  const waitingPatients = allPatients.filter(
    (p) => p.status === "Waiting"
  ).length;
  const criticalPatients = allPatients.filter(
    (p) => p.priority === "Critical"
  ).length;
  const overloadedDepartments = departments.filter(
    (d) => d.loadIndicator === "red"
  ).length;

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

        <main className="p-6">
          <StatsGrid
            totalPatients={totalPatients}
            waitingPatients={waitingPatients}
            criticalPatients={criticalPatients}
            overloadedDepartments={overloadedDepartments}
          />
          <div className="flex justify-end mb-4">
            <ReroutePatientModal
              allPatients={allPatients}
              allDepartments={departments}
              onReroute={handleReroute}
            />
          </div>
          <PatientList departments={filteredDepartments} />
        </main>
      </div>
    </div>
  );
};

export default PatientFlowManagerPage;
