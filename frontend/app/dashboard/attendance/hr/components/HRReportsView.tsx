"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Calendar, 
  BarChart3, 
  PieChart 
} from "lucide-react";

interface HRReportsViewProps {
  attendanceData: any[];
  employees: any[];
}

export default function HRReportsView({ attendanceData, employees }: HRReportsViewProps) {
  const generateReport = (type: string) => {
    // This would typically generate and download a report
    console.log(`Generating ${type} report...`);
    // Implementation would depend on your reporting system
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Employee Name', 'Employee ID', 'Department', 'Date', 'Status', 'Time In', 'Time Out', 'Working Hours'],
      ...attendanceData.map(record => [
        record.employee_name,
        record.employee_id,
        record.department,
        record.date,
        record.status,
        record.time_in || '',
        record.time_out || '',
        record.working_hours || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Attendance Reports
          </CardTitle>
          <CardDescription>Generate and export attendance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Daily Report</h3>
                    <p className="text-sm text-muted-foreground">Today's attendance summary</p>
                  </div>
                </div>
                <Button 
                  onClick={() => generateReport('daily')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Weekly Report</h3>
                    <p className="text-sm text-muted-foreground">7-day attendance analysis</p>
                  </div>
                </div>
                <Button 
                  onClick={() => generateReport('weekly')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Monthly Report</h3>
                    <p className="text-sm text-muted-foreground">Complete monthly analysis</p>
                  </div>
                </div>
                <Button 
                  onClick={() => generateReport('monthly')}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Quick Export</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Export all attendance data to CSV format
            </p>
            <Button onClick={exportToCSV} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
