"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function TopPerformersCards({ top, range, currency }: { top: any[]; range: "week" | "month" | "last15"; currency: Intl.NumberFormat }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {top.map((emp, idx) => {
        const val = range === "week" ? emp.week : range === "last15" ? emp.last15 : emp.month;
        return (
          <Card key={emp.id} className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={emp.photo || ""} alt={emp.name} />
                  <AvatarFallback>{emp.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm text-muted-foreground">#{idx + 1}</div>
                  <div className="font-medium">{emp.name}</div>
                </div>
              </div>
              <Link href={`/dashboard/sales/${emp.id}`}>
                <Button size="sm" variant="outline">View</Button>
              </Link>
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">{range === "week" ? "This Week" : range === "last15" ? "Last 15 Days" : "This Month"}</div>
              <div className="text-3xl font-bold tracking-tight">{currency.format(val.a)}</div>
              <div className="text-sm">{val.c} sales</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}


