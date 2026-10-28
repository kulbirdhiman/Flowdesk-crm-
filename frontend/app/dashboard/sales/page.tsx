"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, TrendingUp, Grid3X3, List, ArrowUpDown, ArrowUp, ArrowDown, Settings, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import TopPerformersCards from "./components/TopPerformersCards";
import SalesCardsView from "./components/SalesCardsView";
import SalesActionBar from "./components/SalesActionBar";
import SalesTable from "./components/SalesTable";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string | null;
  profile_photo?: string | null;
  job_title?: string | null;
}

interface LeadRow {
  assigned_to?: string | null;
  stage?: string | null;
  deal_amount?: number | string | null;
  date_and_time?: string | null;
}

function parseAmount(value: number | string | null | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function isSaleStage(stage?: string | null) {
  if (!stage) return false;
  const s = stage.toLowerCase();
  return s.includes("won") || s.includes("closed won") || s.includes("sale");
}

export default function AdminSalesOverviewPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<"week" | "month" | "last15">("month");
  const [viewType, setViewType] = useState<"cards" | "table">("table");
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    today: true,
    week: true,
    month: true,
    last15: true,
    actions: true
  });
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const currency = useMemo(() => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }), []);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [{ data: emp }, { data: lead }] = await Promise.all([
      supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name, profile_photo, job_title")
        .ilike("job_title", "%sales%"),
      supabase.from("Leads").select("assigned_to, stage, deal_amount, date_and_time"),
    ]);
    setEmployees(emp ?? []);
    setLeads(lead ?? []);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const dayOfWeek = (now.getDay() + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfLast15 = new Date(now);
  startOfLast15.setDate(now.getDate() - 14);
  startOfLast15.setHours(0,0,0,0);

  const list = useMemo(() => {
    const byEmployee: { [id: string]: { name: string; photo: string | null | undefined; today: { c: number; a: number }; week: { c: number; a: number }; month: { c: number; a: number }; last15: { c: number; a: number } } } = {};

    // initialize all employees with zero stats so they always show
    employees.forEach(e => {
      byEmployee[e.whalesync_postgres_id] = {
        name: e.full_name || "Unnamed",
        photo: e.profile_photo || null,
        today: { c: 0, a: 0 },
        week: { c: 0, a: 0 },
        month: { c: 0, a: 0 },
        last15: { c: 0, a: 0 },
      };
    });

    const won = leads.filter(l => isSaleStage(l.stage));
    won.forEach(l => {
      const id = String(l.assigned_to || "");
      if (!id) return;
      const amt = parseAmount(l.deal_amount);
      const d = l.date_and_time ? new Date(l.date_and_time) : null;
      if (byEmployee[id]) {
        if (d && d >= startOfDay && d < endOfDay) { byEmployee[id].today.c++; byEmployee[id].today.a += amt; }
        if (d && d >= startOfWeek && d < endOfWeek) { byEmployee[id].week.c++; byEmployee[id].week.a += amt; }
        if (d && d >= startOfMonth && d < endOfMonth) { byEmployee[id].month.c++; byEmployee[id].month.a += amt; }
        if (d && d >= startOfLast15 && d < endOfDay) { byEmployee[id].last15.c++; byEmployee[id].last15.a += amt; }
      }
    });
    return Object.entries(byEmployee)
      .map(([id, v]) => ({ id, name: v.name, photo: v.photo, today: v.today, week: v.week, month: v.month, last15: v.last15 }))
      .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortField) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "today":
            aValue = a.today.a;
            bValue = b.today.a;
            break;
          case "week":
            aValue = a.week.a;
            bValue = b.week.a;
            break;
          case "month":
            aValue = a.month.a;
            bValue = b.month.a;
            break;
          case "last15":
            aValue = a.last15.a;
            bValue = b.last15.a;
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [employees, leads, search]);

  const top = useMemo(() => {
    const picker = (it: any) => range === "week" ? it.week.a : range === "last15" ? it.last15.a : it.month.a;
    return [...list].sort((a, b) => picker(b) - picker(a)).slice(0, 3);
  }, [list, range]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen font-sans">
          <SiteHeader title="Sales" />
          <div className="flex-1 overflow-hidden">
            <div className="w-full px-4 py-6 space-y-6 h-full flex flex-col">

              {/* Cards View */}
              {viewType === "cards" && (
                <SalesCardsView list={list} top={top} range={range} currency={currency} />
              )}

              {/* Table View */}
              {viewType === "table" && (
                <>
                  <TopPerformersCards top={top} range={range} currency={currency} />

                  <SalesActionBar
                    search={search}
                    setSearch={setSearch}
                    range={range}
                    setRange={setRange}
                    viewType={viewType}
                    setViewType={(v) => setViewType(v as any)}
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                  />

                  <SalesTable
                    list={list}
                    visibleColumns={visibleColumns}
                    getSortIcon={getSortIcon}
                    handleSort={handleSort}
                    currency={currency}
                  />
                </>
              )}
              
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


