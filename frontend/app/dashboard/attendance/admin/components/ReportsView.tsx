"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  PieChart, 
  Download
} from "lucide-react";

interface ReportsViewProps {
  onGenerateReport: (reportType: string) => void;
  onExportData: () => void;
}

export function ReportsView({ onGenerateReport, onExportData }: ReportsViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Reports</CardTitle>
        <CardDescription>Generate and export attendance reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onGenerateReport('monthly')}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Monthly Summary</h3>
                <p className="text-sm text-slate-600">Department-wise attendance</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onGenerateReport('trends')}
          >
            <div className="flex items-center gap-3">
              <PieChart className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Trend Analysis</h3>
                <p className="text-sm text-slate-600">Attendance patterns</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={onExportData}
          >
            <div className="flex items-center gap-3">
              <Download className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-slate-600">CSV/Excel export</p>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
