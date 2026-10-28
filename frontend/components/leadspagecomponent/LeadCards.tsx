"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  UsersIcon,
  DollarSignIcon,
  ActivityIcon,
  CalendarCheckIcon,
  FilterIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- TYPE DEFINITIONS ---
interface Lead {
  whalesync_postgres_id: string;
  name: string;
  stage: string;
  deal_amount: number;
  date_and_time: string;
  assigned_to: string;
  email: string;
  mobile: string;
  city: string;
  source: string;
  client_budget: number;
  current_business_turnover: string;
  services: string;
  interested_in_products: string[];
  follow_up_date: string;
  call_remark: string;
  call_notes: string;
  employee_name: string;
  lead_tag: string;
  assignment_status: string;
  today_s_lead: string;
  whatsapp_link: string;
  profile_photo: string;
  age: number;
  any_other_interests: string;
  expected_closing: string;
  follow_up_day: string;
  last_callback_date: string;
  official_email: string;
  official_number: string;
  stage1: string;
  email_button: string;
  calls: string;
}

// --- SUPABASE HELPER FUNCTION ---
const fetchLeadsData = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('Leads')
    .select('*')
    .order('date_and_time', { ascending: false });

  if (error) {
    throw new Error(`Supabase Error: ${error.message}`);
  }

  return data || [];
};

// --- HELPER COMPONENTS ---
const LoadingSpinner: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-[126px] animate-pulse bg-gradient-to-br from-muted to-transparent rounded-lg border"></div>
    ))}
  </div>
);

const ErrorDisplay: React.FC<{ error: Error }> = ({ error }) => (
  <div className="col-span-full border border-destructive bg-destructive/10 p-4 rounded-lg">
    <h3 className="font-bold text-destructive">Failed to Load Card Data</h3>
    <p className="text-destructive/80 text-sm mt-1">{error.message}</p>
  </div>
);

// --- DYNAMIC KPI CARDS COMPONENT ---
export default function LeadCards() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string; job: string }[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<"sales" | "operations">("sales");

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }),
    []
  );

  const parseCurrency = (value: any): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleanedValue = value.replace(/[^0-9.-]+/g, "");
      const parsed = parseFloat(cleanedValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const fetchKpiData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const leadsData = await fetchLeadsData();
      setLeads(leadsData);
      // fetch employee list for filter
      const { data: emp } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name, job_title")
        .order("full_name");
      setEmployees(
        (emp || []).map((e: any) => ({ id: e.whalesync_postgres_id, name: e.full_name || "Unnamed", job: (e.job_title || "").toLowerCase() }))
      );
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKpiData();
  }, [fetchKpiData]);

  const kpiData = useMemo(() => {
    const todayString = new Date().toISOString().split("T")[0];

    const todayLeads = leads.filter(
      (r) =>
        r.date_and_time &&
        new Date(r.date_and_time).toISOString().split("T")[0] === todayString
    ).length;

    const totalLeads = leads.length;
    const todayFollowUps = leads.filter((r) => {
      const followUpDate = r.follow_up_date
        ? (typeof r.follow_up_date === 'string' ? r.follow_up_date : new Date(r.follow_up_date as any).toISOString()).split('T')[0]
        : undefined;
      const dateMatch = (r.follow_up_day === todayString) || (followUpDate === todayString);
      const employeeMatch = selectedEmployee ? r.assigned_to === selectedEmployee : true;
      return dateMatch && employeeMatch;
    }).length;

    const wonRecords = leads.filter(
      (r) => r.stage?.toLowerCase() === "converted"
    );
    const totalSales = wonRecords.reduce(
      (sum, r) => sum + parseCurrency(r.deal_amount),
      0
    );

    return { todayLeads, totalLeads, todayFollowUps, totalSales };
  }, [leads, selectedEmployee]);

  // Filter employees by team (Sales vs Operations)
  const filteredEmployees = useMemo(() => {
    const isSales = teamFilter === "sales";
    return employees.filter(e => {
      const j = e.job || "";
      if (isSales) return j.includes("sales");
      return j.includes("operation") || j.includes("ops");
    });
  }, [employees, teamFilter]);

  // Reset selected employee if not in current filtered list
  useEffect(() => {
    if (selectedEmployee && !filteredEmployees.some(e => e.id === selectedEmployee)) {
      setSelectedEmployee("");
    }
  }, [teamFilter, filteredEmployees, selectedEmployee]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-sm">
        <CardHeader className="space-y-2">
          <CardDescription className="flex items-center justify-between text-sm">
            <span>Today's Leads</span>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {kpiData.todayLeads}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-sm">
        <CardHeader className="space-y-2">
          <CardDescription className="flex items-center justify-between text-sm">
            <span>Total Leads</span>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {kpiData.totalLeads}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-sm">
        <CardHeader className="space-y-2">
          <CardDescription className="flex items-center justify-between text-sm">
            <span>Today's Follow Up</span>
            <div className="flex items-center gap-2">
              {selectedEmployee && (
                <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={employees.find(e=>e.id===selectedEmployee)?.name}>
                  {employees.find(e=>e.id===selectedEmployee)?.name}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-6 w-6 inline-flex items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-muted">
                    <FilterIcon className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center justify-between gap-2">
                      <span>Filter by Employee</span>
                      <div className="flex items-center gap-1">
                        <button
                          className={`h-6 px-2 rounded-md text-xs border ${teamFilter==='sales' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
                          onClick={() => setTeamFilter('sales')}
                          title="Show Sales team"
                        >
                          Sales
                        </button>
                        <button
                          className={`h-6 px-2 rounded-md text-xs border ${teamFilter==='operations' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
                          onClick={() => setTeamFilter('operations')}
                          title="Show Operations team"
                        >
                          Ops
                        </button>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedEmployee("")}>All Employees</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {filteredEmployees.map((e) => (
                    <DropdownMenuItem key={e.id} onClick={() => setSelectedEmployee(e.id)}>
                      {e.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardDescription>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {kpiData.todayFollowUps}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-sm">
        <CardHeader className="space-y-2">
          <CardDescription className="flex items-center justify-between text-sm">
            <span>Total Sales</span>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {currencyFormatter.format(kpiData.totalSales)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

