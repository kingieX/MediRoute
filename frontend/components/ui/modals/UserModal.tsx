/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Assuming a simplified User type for the modal, since the full type wasn't provided
interface SelectedUserType {
  name: string;
  email: string;
  role: string;
  status?: string;
  specialty?: string | null;
  avatarUrl?: string | null;
  // ... other properties
}

const UserModal = ({
  isOpen,
  setIsOpen,
  selectedUser,
  onSave,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedUser: SelectedUserType | null;
  onSave: (userForm: any) => void;
}) => {
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    status: "Active",
    specialty: "", // 🎯 NEW: Added specialty
    avatarUrl: "", // 🎯 NEW: Added avatarUrl
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setUserForm({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role, // Assuming role is stored in uppercase already, otherwise convert here
        password: "",
        status: selectedUser.status || "Active",
        specialty: selectedUser.specialty || "", // Initialize specialty
        avatarUrl: selectedUser.avatarUrl || "", // Initialize avatarUrl
      });
    } else {
      setUserForm({
        name: "",
        email: "",
        role: "",
        password: "",
        status: "Active",
        specialty: "",
        avatarUrl: "",
      });
    }
  }, [selectedUser]);

  const handleChange = (field: string, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // If creating a new user, password is required
    if (!selectedUser && !userForm.password) {
      // Validation will also happen in SettingsPage, but better to prevent the call here too.
      // A notification should ideally be shown here, but we rely on `onSave` to handle it for now.
    }
    onSave(userForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? "Edit User" : "Add New Staff User"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Full Name</Label>
            <Input
              id="userName"
              placeholder="Enter full name"
              value={userForm.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email Address</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="user@mediroute.com"
              value={userForm.email}
              onChange={(e) => handleChange("email", e.target.value)}
              // Disable email editing for existing users as it's often a primary key
              disabled={!!selectedUser}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">Role</Label>
            <Select
              value={userForm.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrator</SelectItem>
                <SelectItem value="DOCTOR">Doctor</SelectItem>
                <SelectItem value="NURSE">Nurse</SelectItem>
                {/* PATIENT role is generally not created via admin user management */}
              </SelectContent>
            </Select>
          </div>
          {/* 🎯 NEW FIELD: Specialty */}
          <div className="space-y-2">
            <Label htmlFor="userSpecialty">Specialty (Optional)</Label>
            <Input
              id="userSpecialty"
              placeholder="e.g., Cardiology, General Practice"
              value={userForm.specialty}
              onChange={(e) => handleChange("specialty", e.target.value)}
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="userAvatarUrl">Avatar URL (Optional)</Label>
            <Input
              id="userAvatarUrl"
              placeholder="https://example.com/avatar.jpg"
              value={userForm.avatarUrl}
              onChange={(e) => handleChange("avatarUrl", e.target.value)}
            />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="userPassword">
              {selectedUser
                ? "New Password (leave blank to keep current)"
                : "Temporary Password *"}
            </Label>
            <div className="relative">
              <Input
                id="userPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={userForm.password}
                onChange={(e) => handleChange("password", e.target.value)}
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
          {/* <div className="space-y-2">
            <Label htmlFor="userStatus">Status</Label>
            <Select
              value={userForm.status}
              onValueChange={(value) => handleChange("status", value)}
              disabled={!selectedUser} // Status is only relevant for existing users
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !userForm.name ||
              !userForm.email ||
              !userForm.role ||
              (!selectedUser && !userForm.password)
            }
          >
            {selectedUser ? "Update User" : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
