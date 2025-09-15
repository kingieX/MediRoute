import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import React from "react";

const ConfigurationTab = ({
  thresholds,
  configForm,
  setConfigForm,
  handleSaveThreshold,
}) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Current Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {threshold.department}
                  </h4>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Max Patients:</span>
                    <span className="font-medium ml-2">
                      {threshold.maxPatients}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min Staff:</span>
                    <span className="font-medium ml-2">
                      {threshold.minStaff}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Wait Time:</span>
                    <span className="font-medium ml-2">
                      {threshold.maxWaitTime} min
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium ml-2">
                      {threshold.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Configure Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={configForm.department}
                onValueChange={(value) =>
                  setConfigForm((prev) => ({ ...prev, department: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPatients">Maximum Patients</Label>
              <Input
                id="maxPatients"
                type="number"
                placeholder="e.g., 50"
                value={configForm.maxPatients}
                onChange={(e) =>
                  setConfigForm((prev) => ({
                    ...prev,
                    maxPatients: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStaff">Minimum Staff Required</Label>
              <Input
                id="minStaff"
                type="number"
                placeholder="e.g., 4"
                value={configForm.minStaff}
                onChange={(e) =>
                  setConfigForm((prev) => ({
                    ...prev,
                    minStaff: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxWaitTime">Maximum Wait Time (minutes)</Label>
              <Input
                id="maxWaitTime"
                type="number"
                placeholder="e.g., 30"
                value={configForm.maxWaitTime}
                onChange={(e) =>
                  setConfigForm((prev) => ({
                    ...prev,
                    maxWaitTime: e.target.value,
                  }))
                }
              />
            </div>
            <Button onClick={handleSaveThreshold} className="w-full">
              Save Threshold Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationTab;
