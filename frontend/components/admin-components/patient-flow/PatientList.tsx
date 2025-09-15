import { DepartmentCard } from "./DepartmentCard";

interface Patient {
  id: number;
  name: string;
  status: string;
  waitTime: string;
  priority: string;
  admissionTime: string;
}

interface Department {
  id: number;
  name: string;
  status: string;
  loadIndicator: "red" | "yellow" | "green";
  capacity: number;
  patients: Patient[];
}

interface PatientListProps {
  departments: Department[];
}

export const PatientList = ({ departments }: PatientListProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {departments.map((department) => (
      <DepartmentCard key={department.id} department={department} />
    ))}
  </div>
);
