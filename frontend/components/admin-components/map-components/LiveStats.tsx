import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Staff {
  status: string;
}

interface Patient {
  priority: string;
}

interface Room {
  occupied: boolean;
}

interface LiveStatsProps {
  staffData: Staff[];
  patientData: Patient[];
  roomData: Room[];
}

export const LiveStats = ({
  staffData,
  patientData,
  roomData,
}: LiveStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Live Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active Staff</span>
            <span className="font-semibold text-gray-900">
              {staffData.filter((s) => s.status === "Active").length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">On Break</span>
            <span className="font-semibold text-gray-900">
              {staffData.filter((s) => s.status === "Break").length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Patients</span>
            <span className="font-semibold text-gray-900">
              {patientData.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Critical Cases</span>
            <span className="font-semibold text-red-600">
              {patientData.filter((p) => p.priority === "Critical").length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Occupied Rooms</span>
            <span className="font-semibold text-gray-900">
              {roomData.filter((r) => r.occupied).length}/{roomData.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
