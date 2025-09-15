/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Menu,
  Zap,
  Plus,
  User,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useSidebar } from "../SidebarContext";

interface SchedulerHeaderProps {
  onAutoAssign: () => void;
  isAutoAssigning: boolean;
  onSaveTemplate: () => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (isOpen: boolean) => void;
  templateForm: any; // Use a more specific type if available
  setTemplateForm: (form: any) => void; // Use a more specific type if available
}

export const SchedulerHeader = ({
  onAutoAssign,
  isAutoAssigning,
  onSaveTemplate,
  isTemplateModalOpen,
  setIsTemplateModalOpen,
  templateForm,
  setTemplateForm,
}: SchedulerHeaderProps) => {
  const router = useRouter();
  const { setIsSidebarOpen, userData, isLoadingUser } = useSidebar();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("/dashboard/admin/profile");
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          {/* Use the setIsSidebarOpen function from the context */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 block md:hidden">
            Staff Scheduler
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={onAutoAssign}
            disabled={isAutoAssigning}
            className="md:flex items-center space-x-2 hidden"
          >
            <Zap className="h-4 w-4" />
            <span>
              {isAutoAssigning ? "Auto-Assigning..." : "Auto-Assign Shifts"}
            </span>
          </Button>
          <div className="md:block hidden">
            <Dialog
              open={isTemplateModalOpen}
              onOpenChange={setIsTemplateModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Shift Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Template Name</Label>
                    <Input
                      id="templateName"
                      placeholder="e.g., Day Shift"
                      value={templateForm.name}
                      onChange={(e) =>
                        setTemplateForm((prev: any) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={templateForm.startTime}
                        onChange={(e) =>
                          setTemplateForm((prev: any) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={templateForm.endTime}
                        onChange={(e) =>
                          setTemplateForm((prev: any) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role Required</Label>
                    <Select
                      value={templateForm.role}
                      onValueChange={(value) =>
                        setTemplateForm((prev: any) => ({
                          ...prev,
                          role: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Nurse">Nurse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={templateForm.department}
                      onValueChange={(value) =>
                        setTemplateForm((prev: any) => ({
                          ...prev,
                          department: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="ICU">ICU</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsTemplateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={onSaveTemplate}>Save Template</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                {isLoadingUser ? (
                  <div className="flex flex-col space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : (
                  userData && (
                    <div className="flex-1 text-left hidden md:block">
                      <div className="text-sm font-medium text-gray-900">
                        {userData.name}
                        {/* {userData.email} */}
                      </div>
                      <div className="text-xs text-gray-500">
                        {userData.role}
                      </div>
                    </div>
                  )
                )}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
