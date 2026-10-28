"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EmployeeData {
  monthly_payroll?: number
  bank_details?: string
}

interface PayrollTabProps {
  employeeData: EmployeeData
}

export default function PayrollTab({ employeeData }: PayrollTabProps) {
  const parseBankDetails = (bankDetails: string) => {
    if (!bankDetails) return { bankName: "N/A", accountNumber: "N/A", ifscCode: "N/A" }
    
    const lines = bankDetails.split("\n")
    return {
      bankName: lines.find((l) => l.includes("Bank Name"))?.split("-")[1]?.trim() || "N/A",
      accountNumber: lines.find((l) => l.includes("Account No"))?.split("-")[1]?.trim() || "N/A",
      ifscCode: lines.find((l) => l.includes("IFSC Code"))?.split("-")[1]?.trim() || "N/A"
    }
  }

  const bankDetails = parseBankDetails(employeeData.bank_details || "")

  return (
    <div className="mt-0 space-y-4">
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-md">Current Payroll Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Current Salary</p>
              <p className="font-bold">
                {employeeData.monthly_payroll
                  ? `$${Number(employeeData.monthly_payroll).toLocaleString()}`
                  : "N/A"}
              </p>
            </div>
            {employeeData.bank_details && (
              <>
                <div>
                  <p className="text-muted-foreground">Bank Name</p>
                  <p className="font-bold">{bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bank Account Number</p>
                  <p className="font-bold">{bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">IFSC Code</p>
                  <p className="font-bold">{bankDetails.ifscCode}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-bold">Transactions</h3>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Salary For</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                There are no transactions right now.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
