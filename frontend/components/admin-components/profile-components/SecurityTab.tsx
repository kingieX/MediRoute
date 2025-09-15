/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/api/api";
import { useSidebar } from "../SidebarContext";

interface SecurityTabProps {
  securityData: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginSessions: {
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }[];
  };
  onUpdate: (section: "security", data: any) => void;
  addNotification: (type: "success" | "error", message: string) => void;
}

const SecurityTab = ({
  securityData,
  onUpdate,
  addNotification,
}: SecurityTabProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      addNotification("error", "Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification("error", "New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      addNotification("error", "Password must be at least 8 characters long");
      return;
    }

    setIsSaving(true);
    // Simulate API call
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      addNotification("success", "Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // You can also update the lastPasswordChange state here
      onUpdate("security", {
        ...securityData,
        lastPasswordChange: new Date().toISOString().split("T")[0],
      });
    } catch (error: any) {
      addNotification("error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTerminateSession = (sessionIndex: number) => {
    const updatedSessions = securityData.loginSessions.filter(
      (_, index) => index !== sessionIndex
    );
    onUpdate("security", { ...securityData, loginSessions: updatedSessions });
    addNotification("success", "Session terminated successfully");
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button onClick={handleChangePassword} disabled={isSaving}>
              {isSaving ? "Changing Password..." : "Change Password"}
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last password change: {securityData.lastPasswordChange}
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                Two-Factor Authentication
              </div>
              <div className="text-sm text-gray-500">
                {securityData.twoFactorEnabled
                  ? "Your account is protected with 2FA"
                  : "Add an extra layer of security to your account"}
              </div>
            </div>
            <Badge
              className={
                securityData.twoFactorEnabled
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {securityData.twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="mt-4">
            <Button variant="outline">
              {securityData.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityData.loginSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-gray-900">
                      {session.device}
                    </div>
                    {session.current && (
                      <Badge className="bg-green-100 text-green-800">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {session.location}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last active: {session.lastActive}
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTerminateSession(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;
