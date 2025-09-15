import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FloorNavigationProps {
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
}

export const FloorNavigation = ({
  selectedFloor,
  setSelectedFloor,
}: FloorNavigationProps) => {
  const floors = [
    { name: "Ground Floor", description: "Emergency, Reception" },
    { name: "1st Floor", description: "ICU, Surgery" },
    { name: "2nd Floor", description: "Pediatrics, General Wards" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Floor Navigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {floors.map((floor) => (
            <button
              key={floor.name}
              onClick={() => setSelectedFloor(floor.name)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedFloor === floor.name
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{floor.name}</div>
              <div className="text-xs text-gray-500">{floor.description}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
