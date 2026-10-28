"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

type Employee = {
  status: string;
};

export default function EmployeeStatsCards({ employees }: { employees: Employee[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employees.length}</div>
          <p className="text-xs text-muted-foreground">
            {employees.filter((emp) => emp.status === "Active").length} active
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {employees.filter((emp) => emp.status === "Active").length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {employees.filter((emp) => emp.status === "Onboarding").length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resigned</CardTitle>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {employees.filter((emp) => emp.status === "Resigned").length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


