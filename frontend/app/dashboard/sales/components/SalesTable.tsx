"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SalesTable({
  list,
  visibleColumns,
  getSortIcon,
  handleSort,
  currency,
}: {
  list: any[];
  visibleColumns: any;
  getSortIcon: (f: string) => JSX.Element;
  handleSort: (f: string) => void;
  currency: Intl.NumberFormat;
}) {
  return (
    <div className="rounded-md border flex-1 overflow-hidden">
      <div className="overflow-y-auto h-full">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {visibleColumns.name && (
                <TableHead className="w-[50px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("name")} className="h-8 px-2 lg:px-3">
                    Name
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.today && (
                <TableHead className="w-[100px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("today")} className="h-8 px-2 lg:px-3">
                    Today
                    {getSortIcon("today")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.week && (
                <TableHead className="w-[100px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("week")} className="h-8 px-2 lg:px-3">
                    This Week
                    {getSortIcon("week")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.month && (
                <TableHead className="w-[100px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("month")} className="h-8 px-2 lg:px-3">
                    This Month
                    {getSortIcon("month")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.last15 && (
                <TableHead className="w-[100px]">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("last15")} className="h-8 px-2 lg:px-3">
                    Last 15 Days
                    {getSortIcon("last15")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.actions && <TableHead className="w-[100px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((emp) => (
              <TableRow key={emp.id}>
                {visibleColumns.name && (
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {emp.name.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="truncate" title={emp.name}>{emp.name}</span>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.today && (
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-semibold">{emp.today.c} sales</div>
                      <div className="text-xs text-muted-foreground">{currency.format(emp.today.a)}</div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.week && (
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-semibold">{emp.week.c} sales</div>
                      <div className="text-xs text-muted-foreground">{currency.format(emp.week.a)}</div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.month && (
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-semibold">{emp.month.c} sales</div>
                      <div className="text-xs text-muted-foreground">{currency.format(emp.month.a)}</div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.last15 && (
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-semibold">{emp.last15.c} sales</div>
                      <div className="text-xs text-muted-foreground">{currency.format(emp.last15.a)}</div>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell>
                    <Link href={`/dashboard/sales/${emp.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


