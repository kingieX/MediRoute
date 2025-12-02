/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";

interface PreferencesTabProps {
  preferencesData: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    alertSounds: boolean;
    theme: string;
  };
  onSave: (section: "preferences", data: any) => void;
  addNotification: (type: "success" | "error", message: string) => void;
}

const PreferencesTab = ({
  preferencesData,
  onSave,
  addNotification,
}: PreferencesTabProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [preferencesForm, setPreferencesForm] = useState(preferencesData);

  useEffect(() => {
    setPreferencesForm(preferencesData);
  }, [preferencesData]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave("preferences", preferencesForm);
    addNotification("success", "Preferences updated successfully");
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Preferences & Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* General Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferencesForm.language}
                  onValueChange={(value) =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      language: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={preferencesForm.timezone}
                  onValueChange={(value) =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      timezone: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      Eastern Time
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time
                    </SelectItem>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={preferencesForm.dateFormat}
                  onValueChange={(value) =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      dateFormat: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select
                  value={preferencesForm.timeFormat}
                  onValueChange={(value) =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      timeFormat: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12-hour">12-hour</SelectItem>
                    <SelectItem value="24-hour">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    Email Notifications
                  </div>
                  <div className="text-sm text-gray-500">
                    Receive alerts and updates via email
                  </div>
                </div>
                <Button
                  variant={
                    preferencesForm.emailNotifications ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      emailNotifications: !prev.emailNotifications,
                    }))
                  }
                >
                  {preferencesForm.emailNotifications ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    Push Notifications
                  </div>
                  <div className="text-sm text-gray-500">
                    Receive browser notifications
                  </div>
                </div>
                <Button
                  variant={
                    preferencesForm.pushNotifications ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      pushNotifications: !prev.pushNotifications,
                    }))
                  }
                >
                  {preferencesForm.pushNotifications ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    SMS Notifications
                  </div>
                  <div className="text-sm text-gray-500">
                    Receive critical alerts via SMS
                  </div>
                </div>
                <Button
                  variant={
                    preferencesForm.smsNotifications ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      smsNotifications: !prev.smsNotifications,
                    }))
                  }
                >
                  {preferencesForm.smsNotifications ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Alert Sounds</div>
                  <div className="text-sm text-gray-500">
                    Play sound for critical alerts
                  </div>
                </div>
                <Button
                  variant={preferencesForm.alertSounds ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setPreferencesForm((prev) => ({
                      ...prev,
                      alertSounds: !prev.alertSounds,
                    }))
                  }
                >
                  {preferencesForm.alertSounds ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesTab;
