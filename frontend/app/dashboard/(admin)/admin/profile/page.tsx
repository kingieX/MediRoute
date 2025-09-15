/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Settings, User, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/admin-components/profile-components/ProfileHeader";
import PersonalInformationTab from "@/components/admin-components/profile-components/PersonalInformationTab";
import PreferencesTab from "@/components/admin-components/profile-components/PreferencesTab";
import SecurityTab from "@/components/admin-components/profile-components/SecurityTab";
import TopNavigation from "@/components/shared/TopNavigation";
import NotificationList from "@/components/shared/NotificationList";
import { useSidebar } from "@/components/admin-components/SidebarContext";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserDetails, updateUserProfile } from "@/api/api";

interface ProfileData {
  personal: {
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
    avatarUrl: string;
  };
  preferences: {
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
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginSessions: {
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }[];
  };
}

interface Notification {
  id: number;
  type: "success" | "error";
  message: string;
  timestamp: string;
}

const ProfilePage = () => {
  const { userData, isLoadingUser } = useSidebar();
  // console.log("UserData from SidebarContext:", userData);
  const [activeTab, setActiveTab] = useState("personal");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialty: "",
      role: "",
      employeeId: "",
      dateJoined: "",
      bio: "",
      address: "",
      avatarUrl: "",
    },
    preferences: {
      language: "English",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12-hour",
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      alertSounds: true,
      theme: "Light",
    },
    security: {
      twoFactorEnabled: true,
      lastPasswordChange: "2024-12-01",
      loginSessions: [
        {
          device: "Chrome on Windows",
          location: "New York, NY",
          lastActive: "2025-01-06 14:30",
          current: true,
        },
        {
          device: "Safari on iPhone",
          location: "New York, NY",
          lastActive: "2025-01-06 09:15",
          current: false,
        },
        {
          device: "Chrome on MacBook",
          location: "New York, NY",
          lastActive: "2025-01-05 18:45",
          current: false,
        },
      ],
    },
  });

  useEffect(() => {
    if (!isLoadingUser && userData) {
      const nameParts = userData.name ? userData.name.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setProfileData((prev) => ({
        ...prev,
        personal: {
          firstName,
          lastName,
          email: userData.email || "",
          phone: userData.phone || "",
          specialty: userData.specialty || "",
          role: userData.role || "",
          employeeId: userData.id || "",
          dateJoined: userData.createdAt || "",
          bio: userData.bio || "",
          address: userData.address || "",
          avatarUrl: userData.avatarUrl || "",
        },
      }));
    }
  }, [userData, isLoadingUser]);

  const addNotification = (type: "success" | "error", message: string) => {
    const notification: Notification = {
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

  const handleUpdateProfileData = (
    section: keyof ProfileData,
    newData: any
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: newData,
    }));
  };

  // CORRECTED FUNCTION SIGNATURE
  const handleSavePersonalInformation = async (
    section: "personal",
    newData: any
  ) => {
    if (!userData || !userData.id) {
      addNotification("error", "User ID is not available.");
      return;
    }

    try {
      // Merge new data with existing data to prevent undefined values
      const mergedData = { ...profileData.personal, ...newData };

      // Construct the data payload for the API, ensuring to join first and last names
      const apiData = {
        name: `${mergedData.firstName} ${mergedData.lastName}`.trim(),
        email: mergedData.email,
        phone: mergedData.phone,
        specialty: mergedData.specialty,
        bio: mergedData.bio,
        address: mergedData.address,
      };

      // console.log("API data:", apiData); // Log the data before sending
      await updateUserProfile(userData.id, apiData);

      // FETCH THE LATEST USER DATA AFTER A SUCCESSFUL UPDATE
      const updatedUser = await getUserDetails(userData.id);

      // Update the local state with the newly fetched data
      const nameParts = updatedUser.name
        ? updatedUser.name.split(" ")
        : ["", ""];
      setProfileData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          specialty: updatedUser.specialty || "",
          bio: updatedUser.bio || "",
          address: updatedUser.address || "",
          avatarUrl: updatedUser.avatarUrl || "",
          role: updatedUser.role || prev.personal.role,
          employeeId: updatedUser.id,
          dateJoined: updatedUser.createdAt,
        },
      }));

      addNotification("success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      addNotification("error", "Failed to update profile. Please try again.");
    }
  };

  // Handle Image update
  const handleImageUpdate = (newUrl: string) => {
    setProfileData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        avatarUrl: newUrl,
      },
    }));
    addNotification("success", "Profile image updated successfully!");
  };

  if (isLoadingUser) {
    return <Skeleton className="h-10 w-full mb-8" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 lg:ml-0">
        <TopNavigation />
        <NotificationList notifications={notifications} />

        <main className="p-6">
          <ProfileHeader
            profileData={profileData.personal}
            onImageUpdate={handleImageUpdate}
          />

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="personal"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Personal Information</span>
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInformationTab
                profileData={profileData.personal}
                onSave={handleSavePersonalInformation}
                addNotification={addNotification}
              />
            </TabsContent>

            <TabsContent value="preferences">
              <PreferencesTab
                preferencesData={profileData.preferences}
                onSave={handleUpdateProfileData}
                addNotification={addNotification}
              />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab
                securityData={profileData.security}
                onUpdate={handleUpdateProfileData}
                addNotification={addNotification}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
