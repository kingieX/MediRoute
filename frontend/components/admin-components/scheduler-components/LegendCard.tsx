import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LegendCard = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-gray-900">
          Legend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Doctor</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Nurse</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600">Conflict</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
