/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  department: string;
  position: Position;
  lastUpdate: string;
  status: string;
}

interface Patient {
  id: number;
  name: string;
  status: string;
  department: string;
  position: Position;
  lastUpdate: string;
  priority: "Critical" | "High" | "Medium" | "Low";
}

interface Room {
  id: number;
  name: string;
  type: string;
  position: Position;
  occupied: boolean;
}

interface MapSectionProps {
  selectedFloor: string;
  filteredStaff: Staff[];
  filteredPatients: Patient[];
  rooms: Room[];
}

export const MapSection = ({
  selectedFloor,
  filteredStaff,
  filteredPatients,
  rooms,
}: MapSectionProps) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredMarker, setHoveredMarker] = useState<any>(null);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoomLevel(1);
  };

  const getMarkerColor = (
    type: string,
    role?: string,
    status?: string,
    priority?: string
  ) => {
    if (type === "staff") {
      if (status === "Break") return "bg-gray-500";
      return role === "Doctor" ? "bg-blue-500" : "bg-green-500";
    } else {
      switch (priority) {
        case "Critical":
          return "bg-red-600";
        case "High":
          return "bg-red-500";
        case "Medium":
          return "bg-yellow-500";
        default:
          return "bg-orange-500";
      }
    }
  };

  const getRoomColor = (type: string, occupied: boolean) => {
    if (occupied) {
      switch (type) {
        case "Emergency":
          return "bg-red-200 border-red-400";
        case "ICU":
          return "bg-purple-200 border-purple-400";
        case "Pediatrics":
          return "bg-blue-200 border-blue-400";
        case "Surgery":
          return "bg-green-200 border-green-400";
        default:
          return "bg-gray-200 border-gray-400";
      }
    }
    return "bg-white border-gray-300";
  };

  return (
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {selectedFloor} - Live View
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-gray-100 rounded-lg overflow-hidden"
            style={{ height: "600px" }}
          >
            <div
              className="relative w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
              }}
            >
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`absolute border-2 rounded-lg p-2 transition-colors ${getRoomColor(
                    room.type,
                    room.occupied
                  )}`}
                  style={{
                    left: `${room.position.x}%`,
                    top: `${room.position.y}%`,
                    width: "80px",
                    height: "60px",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="text-xs font-medium text-center">
                    {room.name}
                  </div>
                  <div className="text-xs text-center text-gray-600">
                    {room.type}
                  </div>
                </div>
              ))}
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="absolute cursor-pointer transition-all duration-500"
                  style={{
                    left: `${staff.position.x}%`,
                    top: `${staff.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() =>
                    setHoveredMarker({ type: "staff", data: staff })
                  }
                  onMouseLeave={() => setHoveredMarker(null)}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${getMarkerColor(
                      "staff",
                      staff.role,
                      staff.status
                    )} border-2 border-white shadow-lg animate-pulse`}
                  ></div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {staff.name.split(" ")[0]}
                  </div>
                </div>
              ))}
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="absolute cursor-pointer transition-all duration-500"
                  style={{
                    left: `${patient.position.x}%`,
                    top: `${patient.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() =>
                    setHoveredMarker({ type: "patient", data: patient })
                  }
                  onMouseLeave={() => setHoveredMarker(null)}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${getMarkerColor(
                      "patient",
                      undefined,
                      undefined,
                      patient.priority
                    )} border-2 border-white shadow-lg`}
                  ></div>
                </div>
              ))}
              {hoveredMarker && (
                <div
                  className="absolute bg-white p-3 rounded-lg shadow-lg border z-50 pointer-events-none"
                  style={{
                    left: `${hoveredMarker.data.position.x}%`,
                    top: `${hoveredMarker.data.position.y - 10}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {hoveredMarker.data.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {hoveredMarker.type === "staff"
                      ? hoveredMarker.data.role
                      : hoveredMarker.data.status}
                  </div>
                  <div className="text-xs text-gray-600">
                    Department: {hoveredMarker.data.department}
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated: {hoveredMarker.data.lastUpdate}
                  </div>
                  {hoveredMarker.type === "patient" && (
                    <div className="text-xs">
                      <Badge
                        className={`text-xs ${
                          hoveredMarker.data.priority === "Critical"
                            ? "bg-red-100 text-red-800"
                            : hoveredMarker.data.priority === "High"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {hoveredMarker.data.priority}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
