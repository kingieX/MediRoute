import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import React from "react";

interface ExportReportsProps {
  handleExportPDF: () => Promise<void>;
  handleExportCSV: () => Promise<void>;
}

const ExportReports: React.FC<ExportReportsProps> = ({
  handleExportPDF,
  handleExportCSV,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Export Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Export current analytics data and reports for external analysis or
            compliance.
          </div>
          <Button
            onClick={handleExportPDF}
            className="w-full"
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
          <Button
            onClick={handleExportCSV}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>• PDF includes charts and visualizations</p>
              <p>• CSV contains raw data for analysis</p>
              <p>• Reports filtered by current selection</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportReports;
