/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Save,
  Mail,
  Phone,
  Clock,
  Building,
  MapPinIcon,
} from "lucide-react";

interface PersonalInformationTabProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialty: string;
    role: string;
    employeeId: string;
    dateJoined: string;
    bio: string;
    address: string;
  };
  onSave: (section: "personal", data: any) => void;
  addNotification: (type: "success" | "error", message: string) => void;
}

// Utility function to format the date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const PersonalInformationTab = ({
  profileData,
  onSave,
  addNotification,
}: PersonalInformationTabProps) => {
  // console.log("Rendering PersonalInformationTab with data:", profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState(profileData);

  useEffect(() => {
    setEditForm(profileData);
  }, [profileData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Pass the complete form state to the parent component
      await onSave("personal", editForm);
      console.log("Saved data on PersonalInformationTab:", editForm);
      setIsEditing(false);
      addNotification("success", "Personal information updated successfully");
    } catch (error) {
      console.error("Failed to save personal information:", error);
      addNotification("error", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Personal Information
          </CardTitle>
          <Button
            onClick={() => {
              if (isEditing) {
                setEditForm(profileData);
              }
              setIsEditing(!isEditing);
            }}
            variant="outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="specialty"
                value={editForm.specialty}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    specialty: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateJoined">Date Joined</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="dateJoined"
                value={formatDate(profileData.dateJoined)}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, address: e.target.value }))
                }
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editForm.bio}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInformationTab;
