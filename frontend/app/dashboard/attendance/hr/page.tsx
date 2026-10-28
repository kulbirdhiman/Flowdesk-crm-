"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HRSidebar } from "@/components/hr-sidebar";
import { useUserRole } from "@/contexts/UserRoleContext";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Import components
import HRAttendanceKPICards from "./components/HRAttendanceKPICards";
import HRAttendanceFilters from "./components/HRAttendanceFilters";
import HRAttendanceTableView from "./components/HRAttendanceTableView";
import HRAttendanceKanbanView from "./components/HRAttendanceKanbanView";
import HRMarkAttendanceView from "./components/HRMarkAttendanceView";
import HRDepartmentStatsView from "./components/HRDepartmentStatsView";
import HRReportsView from "./components/HRReportsView";
import HRSettingsView from "./components/HRSettingsView";
import HREmployeeDetailsModal from "./components/HREmployeeDetailsModal";
import HRTopPerformersModal from "./components/HRTopPerformersModal";
import HRManualAttendanceModal from "./components/HRManualAttendanceModal";

interface AttendanceRecord {
  id: string;
  employee_name: string;
  employee_id: string;
  department: string;
  date: string;
  status: string;
  time_in?: string;
  time_out?: string;
  working_hours?: number;
  punctuality_status?: string;
  marked_by: string;
  marked_at: string;
  notes?: string;
}

interface Employee {
  id: string;
  name: string;
  employee_id: string;
  department: string;
  position: string;
  email: string;
  profile_photo?: string;
}

interface DepartmentStats {
  department: string;
  total_employees: number;
  present_today: number;
  attendance_rate: number;
  avg_working_hours: number;
}

export default function HRAttendancePage() {
  const { userRole, isLoading: roleLoading } = useUserRole();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    employee: true,
    department: true,
    date: true,
    status: true,
    timeIn: true,
    timeOut: true,
    workingHours: true,
    markedBy: true,
    actions: true
  });
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewType, setViewType] = useState<"table" | "kanban">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [attendanceForm, setAttendanceForm] = useState({
    status: 'Present',
    timeIn: '09:00',
    timeOut: '17:00',
    notes: ''
  });
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isTopPerformersOpen, setIsTopPerformersOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Starting to load data from Supabase...");
      
      // Import Supabase client
      const { supabase } = await import('@/lib/supabaseClient');
      
      // Fetch employees from Employee Directory
      const { data: employeesData, error: employeesError } = await supabase
        .from('Employee Directory')
        .select(`
          whalesync_postgres_id,
          full_name,
          employee_id,
          department,
          profile_photo,
          official_email,
          status
        `)
        .eq('status', 'Active');
      
      if (employeesError) {
        console.error('Error fetching employees:', employeesError);
        throw employeesError;
      }
      
      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('Teams')
        .select('whalesync_postgres_id, team_name');
      
      if (departmentsError) {
        console.error('Error fetching departments:', departmentsError);
        throw departmentsError;
      }
      
      // Create department lookup
      const departmentLookup = {};
      departmentsData?.forEach(team => {
        departmentLookup[team.whalesync_postgres_id] = team.team_name;
      });
      
      // Transform employees data
      const transformedEmployees = employeesData?.map(emp => ({
        id: emp.whalesync_postgres_id,
        name: emp.full_name,
        employee_id: emp.employee_id,
        department: departmentLookup[emp.department] || 'Unknown',
        position: 'Employee', // Default position
        email: emp.official_email,
        profile_photo: emp.profile_photo
      })) || [];
      
      console.log("Setting employees:", transformedEmployees);
      setEmployees(transformedEmployees);
      
      // Fetch attendance data
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('Attendance')
        .select(`
          whalesync_postgres_id,
          date,
          status,
          time_in,
          time_out,
          working_hours,
          punctuality_status,
          notes,
          employee,
          employee_id_from_employee,
          full_name_from_employee,
          department_name_from_employee
        `)
        .order('date', { ascending: false })
        .limit(100); // Limit to recent records
      
      if (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
        throw attendanceError;
      }
      
      // Transform attendance data
      const transformedAttendance = attendanceData?.map(record => ({
        id: record.whalesync_postgres_id,
        employee_name: record.full_name_from_employee || 'Unknown',
        employee_id: record.employee_id_from_employee || 'Unknown',
        department: departmentLookup[record.department_name_from_employee] || 'Unknown',
        date: record.date,
        status: record.status || 'Not Marked',
        time_in: record.time_in ? `${Math.floor(record.time_in)}:${String(Math.round((record.time_in % 1) * 60)).padStart(2, '0')}` : null,
        time_out: record.time_out ? `${Math.floor(record.time_out)}:${String(Math.round((record.time_out % 1) * 60)).padStart(2, '0')}` : null,
        working_hours: record.working_hours || 0,
        punctuality_status: record.punctuality_status || 'Not Marked',
        marked_by: 'HR', // Default value
        marked_at: new Date().toISOString(),
        notes: record.notes || ''
      })) || [];
      
      console.log("Setting attendance data:", transformedAttendance);
      setAttendanceData(transformedAttendance);
      setFilteredData(transformedAttendance);
      
      // Calculate department stats
      calculateDepartmentStats(transformedAttendance, transformedEmployees);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const calculateDepartmentStats = (attendance: AttendanceRecord[], employees: Employee[]) => {
    const today = new Date().toISOString().split('T')[0];
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
    
    const stats = departments.map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept);
      const todayAttendance = attendance.filter(r => r.department === dept && r.date === today);
      const presentToday = todayAttendance.filter(r => r.status === 'Present').length;
      const attendanceRate = deptEmployees.length > 0 ? (presentToday / deptEmployees.length) * 100 : 0;
      const avgHours = todayAttendance.length > 0 ? 
        todayAttendance.reduce((sum, r) => sum + (r.working_hours || 0), 0) / todayAttendance.length : 0;

      return {
        department: dept || 'Unknown',
        total_employees: deptEmployees.length,
        present_today: presentToday,
        attendance_rate: Math.round(attendanceRate),
        avg_working_hours: Math.round(avgHours * 10) / 10
      };
    });

    setDepartmentStats(stats);
  };

  const applyFilters = () => {
    console.log("Applying filters...");
    console.log("attendanceData length:", attendanceData.length);
    console.log("searchTerm:", searchTerm);
    console.log("statusFilter:", statusFilter);
    console.log("departmentFilter:", departmentFilter);
    console.log("timeFilter:", timeFilter);
    
    let filtered = [...attendanceData];
    console.log("Initial filtered length:", filtered.length);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(record => statusFilter.includes(record.status));
      console.log("After status filter:", filtered.length);
    }

    // Department filter
    if (departmentFilter.length > 0) {
      filtered = filtered.filter(record => departmentFilter.includes(record.department));
      console.log("After department filter:", filtered.length);
    }

    // Time filter
    if (timeFilter.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      filtered = filtered.filter(record => {
        if (timeFilter.includes('Today') && record.date === today) return true;
        if (timeFilter.includes('Yesterday') && record.date === yesterday) return true;
        if (timeFilter.includes('Last 7 Days') && record.date >= lastWeek) return true;
        return false;
      });
      console.log("After time filter:", filtered.length);
    }

    console.log("Final filtered length:", filtered.length);
    setFilteredData(filtered);
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
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;
    
    // Update the status based on the destination column
    const newStatus = destination.droppableId;
    const recordId = result.draggableId;
    
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === recordId ? { ...record, status: newStatus } : record
      )
    );
    
    setFilteredData(prev => 
      prev.map(record => 
        record.id === recordId ? { ...record, status: newStatus } : record
      )
    );
  };

  const handleViewRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const handleMarkAttendance = async (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsMarkAttendanceOpen(true);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedEmployee) return;

    try {
      const workingHours = calculateWorkingHours(attendanceForm.timeIn, attendanceForm.timeOut);
      
      // Import Supabase client
      const { supabase } = await import('@/lib/supabaseClient');

      // Convert time strings to decimal format (e.g., "09:00" -> 9.0, "17:30" -> 17.5)
      const timeInDecimal = parseFloat(attendanceForm.timeIn.replace(':', '.'));
      const timeOutDecimal = parseFloat(attendanceForm.timeOut.replace(':', '.'));

      const { error } = await supabase
        .from('Attendance')
        .insert({
          employee: selectedEmployee.id,
          employee_id_from_employee: selectedEmployee.employee_id,
          full_name_from_employee: selectedEmployee.name,
          date: selectedDate,
          status: attendanceForm.status,
          time_in: timeInDecimal,
          time_out: timeOutDecimal,
          working_hours: workingHours,
          punctuality_status: attendanceForm.timeIn <= '09:00' ? 'On Time' : 'Late',
          notes: attendanceForm.notes,
          date_status: selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : 'Before Today',
          day_name_of_date: new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })
        });

      if (error) throw error;

      toast.success(`Attendance marked for ${selectedEmployee.name}`);
      setIsMarkAttendanceOpen(false);
      setSelectedEmployee(null);
      setAttendanceForm({
        status: 'Present',
        timeIn: '09:00',
        timeOut: '17:00',
        notes: ''
      });
      
      loadData(); // Reload data
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  const calculateWorkingHours = (timeIn: string, timeOut: string) => {
    const [inHour, inMin] = timeIn.split(':').map(Number);
    const [outHour, outMin] = timeOut.split(':').map(Number);
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    const diffMinutes = outMinutes - inMinutes;
    return Math.round((diffMinutes / 60) * 10) / 10;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'Present':
        return <span className="bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">Present</span>;
      case 'Absent':
        return <span className="bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs">Absent</span>;
      case 'Half Day':
        return <span className="bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 text-xs">Half Day</span>;
      case 'Holiday':
        return <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs">Holiday</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 text-xs">{status}</span>;
    }
  };

  const getMonthlyStats = (employeeId: string, month: number, year: number) => {
    const records = attendanceData.filter(record => 
      record.employee_id === employeeId &&
      new Date(record.date).getMonth() === month &&
      new Date(record.date).getFullYear() === year
    );
    
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const halfDay = records.filter(r => r.status === 'Half Day').length;
    const total = records.length;
    const attendanceRate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 0;
    
    return { present, absent, halfDay, attendanceRate };
  };

  const getCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const record = selectedRecord ? attendanceData.find(r => 
        r.employee_id === selectedRecord.employee_id && r.date === dateString
      ) : null;
      
      days.push({
        day,
        date: dateString,
        record,
        isToday: dateString === new Date().toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const getTopPerformers = () => {
    const employeeStats = employees.map(emp => {
      const empRecords = attendanceData.filter(record => record.employee_id === emp.employee_id);
      const present = empRecords.filter(r => r.status === 'Present').length;
      const halfDay = empRecords.filter(r => r.status === 'Half Day').length;
      const total = empRecords.length;
      const attendanceRate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 0;
      
      return {
        ...emp,
        present,
        halfDay,
        total,
        attendanceRate
      };
    });

    return employeeStats
      .sort((a, b) => b.attendanceRate - a.attendanceRate)
      .slice(0, 3);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, departmentFilter, timeFilter, attendanceData]);

  // Check if user is HR
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'hr') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <SidebarProvider>
        <HRSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen" suppressHydrationWarning>
            <SiteHeader title="HR Attendance Management" />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading attendance data...</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <HRSidebar />
      <SidebarInset className="h-screen">
        <div className="flex flex-col h-screen bg-background text-foreground" suppressHydrationWarning>
          <SiteHeader title="HR Attendance Management" />
          
          <div className="flex-1 flex flex-col bg-background">
            <div className="p-1 space-y-1 bg-background flex-1 flex flex-col min-h-0">
              {/* KPI Cards */}
              <HRAttendanceKPICards 
                employees={employees}
                attendanceData={attendanceData}
                departmentStats={departmentStats}
              />

              {/* Main Content Tabs */}
              <Tabs defaultValue="analytics" className="space-y-2">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="mark-attendance">Mark Attendance</TabsTrigger>
                  <TabsTrigger value="departments">Departments</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-0">
                  {/* Filters */}
                  <HRAttendanceFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    departmentFilter={departmentFilter}
                    setDepartmentFilter={setDepartmentFilter}
                    timeFilter={timeFilter}
                    setTimeFilter={setTimeFilter}
                    viewType={viewType}
                    setViewType={setViewType}
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                    employees={employees}
                  />

                  {/* Table View */}
                  {viewType === "table" && (
                    <HRAttendanceTableView
                      paginatedData={paginatedData}
                      visibleColumns={visibleColumns}
                      handleSort={handleSort}
                      getSortIcon={getSortIcon}
                      handleViewRecord={handleViewRecord}
                      handleEditRecord={handleEditRecord}
                      getStatusBadge={getStatusBadge}
                      filteredData={filteredData}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handleFirstPage={handleFirstPage}
                      handlePrevPage={handlePrevPage}
                      handleNextPage={handleNextPage}
                      handleLastPage={handleLastPage}
                    />
                  )}

                  {/* Kanban View */}
                  {viewType === "kanban" && (
                    <HRAttendanceKanbanView
                      paginatedData={paginatedData}
                      handleDragEnd={handleDragEnd}
                      handleViewRecord={handleViewRecord}
                      handleEditRecord={handleEditRecord}
                      filteredData={filteredData}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handleFirstPage={handleFirstPage}
                      handlePrevPage={handlePrevPage}
                      handleNextPage={handleNextPage}
                      handleLastPage={handleLastPage}
                      setIsTopPerformersOpen={setIsTopPerformersOpen}
                    />
                  )}
                </TabsContent>

                {/* Mark Attendance Tab */}
                <TabsContent value="mark-attendance" className="space-y-4 flex-1 flex flex-col min-h-0">
                  <HRMarkAttendanceView
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    employees={employees}
                    handleMarkAttendance={handleMarkAttendance}
                  />
                </TabsContent>

                {/* Departments Tab */}
                <TabsContent value="departments" className="space-y-4">
                  <HRDepartmentStatsView departmentStats={departmentStats} />
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                  <HRReportsView 
                    attendanceData={attendanceData}
                    employees={employees}
                  />
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                  <HRSettingsView />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Modals */}
      <HRManualAttendanceModal
        isOpen={isMarkAttendanceOpen}
        onClose={() => setIsMarkAttendanceOpen(false)}
        selectedEmployee={selectedEmployee}
        attendanceForm={attendanceForm}
        setAttendanceForm={setAttendanceForm}
        handleSubmitAttendance={handleSubmitAttendance}
      />

      <HREmployeeDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        selectedRecord={selectedRecord}
        attendanceData={attendanceData}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        getMonthlyStats={getMonthlyStats}
        getCalendarDays={getCalendarDays}
        handleViewRecord={handleViewRecord}
      />

      <HRTopPerformersModal
        isOpen={isTopPerformersOpen}
        onClose={() => setIsTopPerformersOpen(false)}
        getTopPerformers={getTopPerformers}
        employees={employees}
        attendanceData={attendanceData}
      />
    </SidebarProvider>
  );
}