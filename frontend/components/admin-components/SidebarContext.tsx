"use client";

import { User } from "@/api/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getAuthenticatedUser } from "@/api/api";
import { useRouter } from "next/navigation";

interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  userData: User | null;
  isLoadingUser: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getAuthenticatedUser();
        setUserData(user);
      } catch (error) {
        console.error("Failed to fetch authenticated user:", error);
        // Redirect to login if user is not authenticated
        router.push("/login");
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, [router]);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        userData,
        isLoadingUser,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
