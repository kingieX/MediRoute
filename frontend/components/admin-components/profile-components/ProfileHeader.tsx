/* eslint-disable @next/next/no-img-element */
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
import { uploadProfileImage } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileHeaderProps {
  profileData: {
    firstName: string;
    lastName: string;
    role: string;
    specialty: string;
    employeeId: string;
    bio: string;
    avatarUrl: string;
  };
  onImageUpdate: (url: string) => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Administrator":
      return "bg-purple-100 text-purple-800";
    case "Doctor":
      return "bg-blue-100 text-blue-800";
    case "Nurse":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ProfileHeader = ({ profileData, onImageUpdate }: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadProfileImage(profileData.employeeId, file);
        onImageUpdate(imageUrl);
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fullImageUrl = profileData.avatarUrl
    ? `${API_BASE_URL}${profileData.avatarUrl}`
    : "/images/default-avatar.png";

  console.log("Full Image URL:", fullImageUrl);

  return (
    <div className="mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              {isUploading ? (
                <Skeleton className="w-28 h-28 rounded-full" />
              ) : (
                <img
                  src={fullImageUrl}
                  alt="Profile Picture"
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm"
                />
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={handleImageClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 bg-gray-900 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Camera size={20} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getRoleColor(profileData.role)}>
                  {profileData.role}
                </Badge>
                <span className="text-gray-600">{profileData.specialty}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">
                  ID: {profileData.employeeId}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{profileData.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHeader;
