"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, BarChart3, Building2, CreditCard } from "lucide-react";

interface EmployeeData {
  monthly_payroll?: number;
  bank_details?: string;
}

interface PayrollInfoProps {
  employeeData: EmployeeData | null;
}

export default function PayrollInfo({ employeeData }: PayrollInfoProps) {
  const getBankInfo = (field: string) => {
    if (!employeeData?.bank_details) return "N/A";
    const line = employeeData.bank_details.split("\n").find((l) => l.includes(field));
    return line?.split("-")[1]?.trim() || "N/A";
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payroll Information</h3>
        <p className="text-sm text-muted-foreground">Current salary details and payment history</p>
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <p className="text-2xl font-bold text-foreground">
                  {employeeData?.monthly_payroll
                    ? `₹${Number(employeeData.monthly_payroll).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">₹</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual Salary</p>
                <p className="text-xl font-bold text-foreground">
                  {employeeData?.monthly_payroll
                    ? `₹${(Number(employeeData.monthly_payroll) * 12).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bank</p>
                <p className="text-sm font-medium text-foreground">
                  {getBankInfo("Bank Name")}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Account</p>
                <p className="text-sm font-medium text-foreground">
                  {getBankInfo("Account No")}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Details */}
      {employeeData?.bank_details && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Banking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bank Name</span>
                  <span className="text-sm font-medium">
                    {getBankInfo("Bank Name")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Number</span>
                  <span className="text-sm font-medium font-mono">
                    {getBankInfo("Account No")}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IFSC Code</span>
                  <span className="text-sm font-medium font-mono">
                    {getBankInfo("IFSC Code")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <span className="text-sm font-medium">Salary Account</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Payment History</h3>
        <Button variant="outline" size="sm">
          Export Records
        </Button>
      </div>
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium">No payment records</p>
            <p className="text-sm">Payment history will appear here once transactions are recorded</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
