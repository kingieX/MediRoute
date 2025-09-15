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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

const UserModal = ({ isOpen, setIsOpen, selectedUser, onSave }) => {
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    status: "Active",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setUserForm({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        password: "",
        status: selectedUser.status,
      });
    } else {
      setUserForm({
        name: "",
        email: "",
        role: "",
        password: "",
        status: "Active",
      });
    }
  }, [selectedUser]);

  const handleSave = () => {
    onSave(userForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? "Edit User" : "Add New User"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Full Name</Label>
            <Input
              id="userName"
              placeholder="Enter full name"
              value={userForm.name}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email Address</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="user@mediroute.com"
              value={userForm.email}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">Role</Label>
            <Select
              value={userForm.role}
              onValueChange={(value) =>
                setUserForm((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Administrator</SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Nurse">Nurse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPassword">
              {selectedUser
                ? "New Password (leave blank to keep current)"
                : "Temporary Password"}
            </Label>
            <div className="relative">
              <Input
                id="userPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userStatus">Status</Label>
            <Select
              value={userForm.status}
              onValueChange={(value) =>
                setUserForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {selectedUser ? "Update User" : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
