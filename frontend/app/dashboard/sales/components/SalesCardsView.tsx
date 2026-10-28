"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function SalesCardsView({ list, top, range, currency }: { list: any[]; top: any[]; range: "week" | "month" | "last15"; currency: Intl.NumberFormat }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="mt-6">
        <h2 className="text-base font-semibold mb-3">All Salespeople</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((emp) => (
            <Card key={emp.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={emp.photo || ""} alt={emp.name} />
                    <AvatarFallback>{emp.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{emp.name}</div>
                </div>
                <Link href={`/dashboard/sales/${emp.id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Today</div>
                  <div className="font-semibold">{emp.today.c}</div>
                  <div className="text-xs">{currency.format(emp.today.a)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Week</div>
                  <div className="font-semibold">{emp.week.c}</div>
                  <div className="text-xs">{currency.format(emp.week.a)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{range === "last15" ? "Last 15" : "Month"}</div>
                  <div className="font-semibold">{range === "last15" ? emp.last15.c : emp.month.c}</div>
                  <div className="text-xs">{currency.format(range === "last15" ? emp.last15.a : emp.month.a)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}


