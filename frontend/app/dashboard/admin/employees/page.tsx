"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Edit2, 
  Trash2, 
  Plus, 
  List, 
  Grid, 
  LayoutGrid,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  UserPlus,
  RefreshCw,
  X
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import EmployeeStatsCards from "./components/EmployeeStatsCards";
import EmployeeSearchBar from "./components/EmployeeSearchBar";
import EmployeeListTable from "./components/EmployeeListTable";
import EmployeeGridView from "./components/EmployeeGridView";
import PaginationBar from "./components/PaginationBar";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";

type Employee = {
  whalesync_postgres_id: string;
  full_name: string;
  aadhar_number?: string;
  airtable_created_time?: string;
  airtable_record_id?: string;
  bank_details?: any;
  calls?: any;
  contacts?: any;
  current_address?: string;
  date_of_joining?: string;
  dob?: string;
  emails_access?: any;
  emergency_contact_details?: any;
  employee_id?: string;
  employment_type?: string;
  epf_deduction?: any;
  esic_deduction?: any;
  leads?: any;
  linkedin_profile?: string;
  monthly_payroll?: any;
  job_title?: string;
  reporting_manager?: string;
  official_contact_number?: string;
  official_email: string;
  official_number?: string;
  pan_number?: string;
  permanent_address?: string;
  personal_contact_number?: string;
  personal_email?: string;
  profile_photo?: string;
  status: string;
  total_working_days_this_month?: number;
  uan_number?: string;
  work_mode?: string;
  users?: any;
  Notes?: string;
  Announcement?: any;
  department?: {
    whalesync_postgres_id: string;
    department_name: string;
    display_name?: string;
    headcount?: number;
  } | null;
};

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [view, setView] = useState<'list' | 'grid' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Paginated employees
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Total pages calculation
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching employee data for admin...');
        
        // Fetch employees with reporting manager data
        const { data: employeesData, error: employeesError } = await supabase
          .from('Employee Directory')
          .select(`
            *,
            reporting_manager:reporting_manager(
              whalesync_postgres_id,
              full_name,
              job_title
            )
          `);
        
        if (employeesError) {
          console.error('Employee Directory fetch error:', employeesError);
          throw new Error(`Failed to fetch employees: ${employeesError.message}`);
        }

        console.log('Raw employees data received:', employeesData?.length || 0, 'records');

        // Process employee data
        const safeEmployeesData = (employeesData || []).map((emp, index) => {
          console.log(`Employee ${emp.full_name}:`, {
            jobTitle: emp.job_title,
            reportingManager: emp.reporting_manager
          });
          
          return {
            ...emp,
            whalesync_postgres_id: emp.whalesync_postgres_id || `emp_${index}`,
            full_name: emp.full_name || `Unnamed Employee ${index}`,
            official_email: emp.official_email || '',
            employment_type: emp.employment_type || 'Full-time',
            status: emp.status || 'Active',
            profile_photo: emp.profile_photo || null,
            date_of_joining: emp.date_of_joining || null,
            work_mode: emp.work_mode || 'Office',
            job_title: emp.job_title || null,
            reporting_manager: emp.reporting_manager?.full_name || emp.reporting_manager || null
          };
        });

        console.log('Processed employees data:', safeEmployeesData.length, 'records');
        
        // Debug: Show first few employees with their job and manager data
        console.log('=== EMPLOYEE DEBUG INFO ===');
        safeEmployeesData.slice(0, 3).forEach((emp, index) => {
          console.log(`Employee ${index + 1}: ${emp.full_name}`);
          console.log('  - Job Title:', emp.job_title);
          console.log('  - Reporting Manager:', emp.reporting_manager);
          console.log('  - Raw employee data keys:', Object.keys(emp));
        });
        console.log('=== END DEBUG INFO ===');
        
        setEmployees(safeEmployeesData);
        setFilteredEmployees(safeEmployeesData);
        toast.success(`Loaded ${safeEmployeesData.length} employees`);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort employees
  useEffect(() => {
    let result = employees;
    
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(emp => 
        (emp.full_name && emp.full_name.toLowerCase().includes(searchTermLower)) ||
        (emp.official_email && emp.official_email.toLowerCase().includes(searchTermLower)) ||
        (emp.employment_type && emp.employment_type.toLowerCase().includes(searchTermLower)) ||
        (emp.employee_id && emp.employee_id.toLowerCase().includes(searchTermLower))
      );
    }

    // Apply sorting
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let aValue: string = '';
        let bValue: string = '';

        switch (sortColumn) {
          case 'name':
            aValue = a.full_name || '';
            bValue = b.full_name || '';
            break;
          case 'employment_type':
            aValue = a.employment_type || '';
            bValue = b.employment_type || '';
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          case 'work_mode':
            aValue = a.work_mode || '';
            bValue = b.work_mode || '';
            break;
          case 'reporting_manager':
            aValue = a.reporting_manager || '';
            bValue = b.reporting_manager || '';
            break;
          case 'job_title':
            aValue = a.job_title || '';
            bValue = b.job_title || '';
            break;
          case 'date_of_joining':
            aValue = a.date_of_joining || '';
            bValue = b.date_of_joining || '';
            break;
          default:
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        }

        return 0;
      });
    }
    
    setFilteredEmployees(result);
  }, [employees, searchTerm, sortColumn, sortDirection]);

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
    );
  };

  // Determine badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'Active': return 'default';
      case 'Resigned': return 'destructive';
      case 'Onboarding': return 'secondary';
      default: return 'outline';
    }
  };

  // Handle employee deletion
  const handleDelete = async (whalesync_postgres_id: string) => {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('Employee Directory')
        .delete()
        .eq('whalesync_postgres_id', whalesync_postgres_id);
      
      if (error) throw error;
      
      setEmployees(prev => prev.filter(emp => emp.whalesync_postgres_id !== whalesync_postgres_id));
      setFilteredEmployees(prev => prev.filter(emp => emp.whalesync_postgres_id !== whalesync_postgres_id));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  // Handle view employee details
  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailsModalOpen(true);
  };

  // Pagination handlers
  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleAddEmployee = () => setSelectedEmployee({} as Employee);

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader title="Admin - Employee Management" />
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto animate-spin border-2 border-muted border-t-primary rounded-full"></div>
              <p className="mt-4 text-muted-foreground">Loading employees...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <SiteHeader title="Admin - Employee Management" />

          {/* Main Content */}
          <div className="flex flex-col overflow-hidden flex-1">
          <EmployeeStatsCards employees={employees} />

          <EmployeeSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            view={view}
            setView={setView}
            onAdd={handleAddEmployee}
          />

            {/* Employees List */}
            <div className="flex-1 overflow-hidden px-4">
              <div className="h-full overflow-auto">
                {filteredEmployees.length > 0 ? (
                  view === 'list' ? (
                    <EmployeeListTable
                      employees={paginatedEmployees as any}
                      onView={handleViewDetails as any}
                      onEdit={(e) => setSelectedEmployee(e as any)}
                      onDelete={handleDelete}
                      onSort={handleSort}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                    />
                  ) : (
                    <EmployeeGridView
                      employees={paginatedEmployees as any}
                      onView={handleViewDetails as any}
                      onEdit={(e) => setSelectedEmployee(e as any)}
                      onDelete={handleDelete}
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No employees found</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {filteredEmployees.length > 0 && (
              <PaginationBar
                total={filteredEmployees.length}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                first={handleFirstPage}
                prev={handlePreviousPage}
                next={handleNextPage}
                last={handleLastPage}
              />
            )}
          </div>
        </div>

        <EmployeeDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          employee={selectedEmployee as any}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
