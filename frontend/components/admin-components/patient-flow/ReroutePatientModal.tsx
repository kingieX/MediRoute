import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  status: string;
}

interface Department {
  id: number;
  name: string;
  capacity: number;
}

interface ReroutePatientModalProps {
  allPatients: Patient[];
  allDepartments: Department[];
  onReroute: (patientName: string, targetDeptName: string) => void;
}

export const ReroutePatientModal = ({
  allPatients,
  allDepartments,
  onReroute,
}: ReroutePatientModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [targetDepartment, setTargetDepartment] = useState("");

  const handleConfirm = () => {
    onReroute(selectedPatient, targetDepartment);
    setSelectedPatient("");
    setTargetDepartment("");
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowRight className="h-4 w-4 mr-2" />
          Reroute Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reroute Patient</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Select Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose patient to reroute" />
              </SelectTrigger>
              <SelectContent>
                {allPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.name}>
                    {patient.name} - {patient.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Target Department</Label>
            <Select
              value={targetDepartment}
              onValueChange={setTargetDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose target department" />
              </SelectTrigger>
              <SelectContent>
                {allDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Reroute</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
