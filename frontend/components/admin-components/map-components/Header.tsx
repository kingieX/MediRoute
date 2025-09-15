import {
  Menu,
  RefreshCw,
  Filter,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useSidebar } from "../SidebarContext";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
}

export const Header = ({
  selectedFloor,
  setSelectedFloor,
  selectedFilter,
  setSelectedFilter,
  handleRefresh,
  isRefreshing,
}: HeaderProps) => {
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
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Hospital Resource Map
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative md:flex hidden space-x-4">
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                <SelectItem value="1st Floor">1st Floor</SelectItem>
                <SelectItem value="2nd Floor">2nd Floor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Doctor">Doctors</SelectItem>
                <SelectItem value="Nurse">Nurses</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
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
