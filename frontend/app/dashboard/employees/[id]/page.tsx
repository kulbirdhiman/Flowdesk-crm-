"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import QuickNotesSection from "./components/QuickNotesSection";
import EmployeeProfileCard from "./components/EmployeeProfileCard";
import ContactDetailsSection from "./components/ContactDetailsSection";
import EmploymentTab from "./components/EmploymentTab";
import DocumentTab from "./components/DocumentTab";
import PayrollTab from "./components/PayrollTab";
import AttendanceTab from "./components/AttendanceTab";
import CallsTab from "./components/CallsTab";
import AddDocumentModal from "./components/AddDocumentModal";
import { EmployeeData, CallData, AttendanceData, DocumentData, Department } from "./components/types";
import { filterCalls } from "./components/utils";

export default function EmployeeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [allEmployees, setAllEmployees] = useState<EmployeeData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [calls, setCalls] = useState<CallData[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  
  const [activeTab, setActiveTab] = useState("detail");
  const [activeDocTab, setActiveDocTab] = useState("submitted");
  const [addDocModalOpen, setAddDocModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [callsDate, setCallsDate] = useState("");
  const [callsSearch, setCallsSearch] = useState("");
  
  // Quick Notes state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    loadEmployeeData();
  }, [employeeId]);

  // Update notes value when employee data changes
  useEffect(() => {
    if (employeeData?.Notes) {
      setNotesValue(employeeData.Notes);
    }
  }, [employeeData]);

  const loadEmployeeData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch employee with teams relationship
      const { data: employee, error: empError } = await supabase
        .from("Employee Directory")
        .select(`
          *,
          teams:teams(*),
          reporting_manager:reporting_manager(*)
        `)
        .eq("id", employeeId)
        .single();

      if (empError) throw empError;
      if (!employee) throw new Error("Employee not found");

      setEmployeeData(employee);

      // Fetch all other data
      const [
        { data: employeesData, error: allEmpError },
        { data: departmentsData, error: deptError },
        { data: callsData, error: callsError },
        { data: attendanceData, error: attError },
        { data: documentsData, error: docsError },
      ] = await Promise.all([
        supabase.from("Employee Directory").select(`
          *,
          teams:teams(*)
        `),
        supabase.from("Teams").select("id, team_name"),
        supabase.from("Calls").select("*").eq("employee", employeeId),
        supabase.from("Attendance").select("*").eq("employee", employeeId),
        supabase.from("Employee Documents").select("*").eq("employee", employeeId),
      ]);

      if (allEmpError) console.warn("Error loading all employees:", allEmpError);
      if (deptError) console.warn("Error loading departments:", deptError);

      setAllEmployees(employeesData || []);
      setDepartments(departmentsData?.map(d => ({ whalesync_postgres_id: String(d.id), department_name: d.team_name })) || []);
      setCalls(callsData || []);
      setAttendance(attendanceData || []);
      setDocuments(documentsData || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const getManager = () => {
    if (!employeeData?.reporting_manager) return null;
    return allEmployees.find((emp) => emp.id === employeeData.reporting_manager);
  };

  const getDepartment = () => {
    if (!employeeData?.teams) return null;
    return { department_name: employeeData.teams.team_name };
  };

  const getDirectReports = () => {
    return allEmployees.filter((emp) => emp.reporting_manager === employeeData?.id);
  };

  // Quick Notes functions
  const handleSaveNotes = async () => {
    if (!employeeData?.id) return;
    
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from("Employee Directory")
        .update({ Notes: notesValue })
        .eq("id", employeeData.id);

      if (error) throw error;

      // Update local state
      setEmployeeData(prev => prev ? { ...prev, Notes: notesValue } : null);
      setIsEditingNotes(false);
      toast.success("Notes saved successfully!");
    } catch (err) {
      console.error("Error saving notes:", err);
      toast.error(`Failed to save notes: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setNotesValue(employeeData?.Notes || "");
    setIsEditingNotes(false);
  };

  const handleEditNotes = () => {
    setIsEditingNotes(true);
  };

  const handleAddDocument = () => {
    setAddDocModalOpen(true);
  };

  const handleSaveDocument = () => {
    toast.success("Document added successfully");
    setAddDocModalOpen(false);
  };

  const filteredCalls = filterCalls(calls, callsDate, callsSearch);
  const submittedDocs = documents.filter((doc) => doc.collection_status === "Submitted");
  const notSubmittedDocs = documents.filter((doc) => doc.collection_status !== "Submitted");

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <SiteHeader title="Employee Details" />
            <div className="flex flex-col items-center justify-center flex-1">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading employee details...</p>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  if (error || !employeeData) {
    return (
      <div className="flex h-screen bg-background">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <SiteHeader title="Employee Details" />
            <div className="flex flex-col items-center justify-center flex-1">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h3 className="mt-2 text-lg font-medium">Could not load employee details</h3>
              <p className="mt-1 text-sm text-muted-foreground">{error || "No data found"}</p>
              <Button onClick={() => router.back()} className="mt-4" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  const manager = getManager();
  const department = getDepartment();
  const directReports = getDirectReports();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <SiteHeader title="Employee Details" />

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-4">
              <Button onClick={() => router.back()} variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Employees
              </Button>

              {/* Quick Notes Section */}
              <QuickNotesSection
                notesValue={notesValue}
                isEditingNotes={isEditingNotes}
                isSavingNotes={isSavingNotes}
                onEditNotes={handleEditNotes}
                onSaveNotes={handleSaveNotes}
                onCancelNotes={handleCancelNotes}
                onNotesChange={setNotesValue}
              />

              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b px-4">
                      <TabsList className="bg-transparent h-auto p-0 w-full justify-start overflow-x-auto">
                        {["detail", "employment", "document", "payroll", "attendance", "calls", "settings"].map((tab) => (
                          <TabsTrigger
                            key={tab}
                            value={tab}
                            className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-3 capitalize"
                          >
                            {tab === "calls" ? `Calls (${calls.length})` : tab}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    <div className="p-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                      {/* Detail Tab */}
                      <TabsContent value="detail" className="mt-0 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <EmployeeProfileCard
                            employeeData={employeeData}
                            department={department}
                            manager={manager}
                          />
                          <ContactDetailsSection employeeData={employeeData} />
                        </div>
                      </TabsContent>

                      {/* Employment Tab */}
                      <TabsContent value="employment" className="mt-0 space-y-3">
                        <EmploymentTab
                          employeeData={employeeData}
                          manager={manager}
                          directReports={directReports}
                        />
                      </TabsContent>

                      {/* Document Tab */}
                      <TabsContent value="document" className="mt-0 space-y-3">
                        <DocumentTab
                          submittedDocs={submittedDocs}
                          notSubmittedDocs={notSubmittedDocs}
                          activeDocTab={activeDocTab}
                          onDocTabChange={setActiveDocTab}
                          onAddDocument={handleAddDocument}
                        />
                      </TabsContent>

                      {/* Payroll Tab */}
                      <TabsContent value="payroll" className="mt-0 space-y-4">
                        <PayrollTab employeeData={employeeData} />
                      </TabsContent>

                      {/* Attendance Tab */}
                      <TabsContent value="attendance" className="mt-0 space-y-4">
                        <AttendanceTab
                          attendance={attendance}
                          selectedDate={selectedDate}
                          onDateChange={setSelectedDate}
                        />
                      </TabsContent>

                      {/* Calls Tab */}
                      <TabsContent value="calls" className="mt-0 space-y-4">
                        <CallsTab
                          calls={calls}
                          filteredCalls={filteredCalls}
                          callsDate={callsDate}
                          callsSearch={callsSearch}
                          onDateChange={setCallsDate}
                          onSearchChange={setCallsSearch}
                        />
                      </TabsContent>

                      {/* Settings Tab */}
                      <TabsContent value="settings" className="mt-0">
                        <div className="text-center text-muted-foreground py-8">Settings tab content will go here.</div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="mt-4 text-xs text-muted-foreground text-right">
                Design & Developed by Startup Squad Pvt. Ltd.
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>

      {/* Add Document Modal */}
      <AddDocumentModal
        isOpen={addDocModalOpen}
        onClose={() => setAddDocModalOpen(false)}
        onSave={handleSaveDocument}
      />
    </div>
  );
}