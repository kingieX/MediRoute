import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DepartmentModal = ({ isOpen, setIsOpen, selectedDepartment, onSave }) => {
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    capacity: "",
    threshold: "",
    manager: "",
  });

  useEffect(() => {
    if (selectedDepartment) {
      setDepartmentForm({
        name: selectedDepartment.name,
        capacity: selectedDepartment.capacity.toString(),
        threshold: selectedDepartment.threshold.toString(),
        manager: selectedDepartment.manager,
      });
    } else {
      setDepartmentForm({
        name: "",
        capacity: "",
        threshold: "",
        manager: "",
      });
    }
  }, [selectedDepartment]);

  const handleSave = () => {
    onSave(departmentForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedDepartment ? "Edit Department" : "Add New Department"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="deptName">Department Name</Label>
            <Input
              id="deptName"
              placeholder="e.g., Emergency"
              value={departmentForm.name}
              onChange={(e) =>
                setDepartmentForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deptCapacity">Maximum Capacity</Label>
            <Input
              id="deptCapacity"
              type="number"
              placeholder="e.g., 50"
              value={departmentForm.capacity}
              onChange={(e) =>
                setDepartmentForm((prev) => ({
                  ...prev,
                  capacity: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deptThreshold">Alert Threshold</Label>
            <Input
              id="deptThreshold"
              type="number"
              placeholder="e.g., 40"
              value={departmentForm.threshold}
              onChange={(e) =>
                setDepartmentForm((prev) => ({
                  ...prev,
                  threshold: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deptManager">Department Manager</Label>
            <Input
              id="deptManager"
              placeholder="e.g., Dr. Sarah Johnson"
              value={departmentForm.manager}
              onChange={(e) =>
                setDepartmentForm((prev) => ({
                  ...prev,
                  manager: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {selectedDepartment ? "Update Department" : "Create Department"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentModal;
