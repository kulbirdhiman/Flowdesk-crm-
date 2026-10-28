"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EmployeeDetailsModal } from "@/components/EmployeeDetailsModal";
import { toast } from "sonner";

// Import components
import EmployeeStatisticsCards from "./components/EmployeeStatisticsCards";
import EmployeeFilters from "./components/EmployeeFilters";
import EmployeeListView from "./components/EmployeeListView";
import EmployeeGridView from "./components/EmployeeGridView";
import EmployeeKanbanView from "./components/EmployeeKanbanView";
import EmployeePagination from "./components/EmployeePagination";
import EmployeeForm from "./components/EmployeeForm";

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

type Team = {
  id: number;
  team_name: string;
  status: string;
};

type Department = {
  whalesync_postgres_id: string;
  department_name: string;
  display_name?: string;
  employees?: any;
  head_manager?: any;
  headcount?: number;
  status: string;
  teams?: any;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [view, setView] = useState<'list' | 'grid' | 'kanban'>('list');
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for controlled components
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    employmentType: 'Full-time',
    workMode: 'Office',
    status: 'Active',
    dateOfJoining: '',
    phone: '',
    address: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Kanban board state
  const [employeeColumns, setEmployeeColumns] = useState<{
    [key: string]: Employee[]
  }>({
    'Active': [],
    'Onboarding': [],
    'Resigned': []
  });

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Calculate statistics
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'Active').length,
    onboarding: employees.filter(emp => emp.status === 'Onboarding').length,
    resigned: employees.filter(emp => emp.status === 'Resigned').length
  };

  // Paginated employees
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Total pages calculation
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredEmployees]);

  // Prepare Kanban columns when employees change
  useEffect(() => {
    const columns: { [key: string]: Employee[] } = {
      'Active': [],
      'Onboarding': [],
      'Resigned': []
    };

    const uniqueEmployees = filteredEmployees.filter((emp, index, self) => 
      index === self.findIndex(e => e.whalesync_postgres_id === emp.whalesync_postgres_id)
    );

    uniqueEmployees.forEach(emp => {
      const status = emp.status || 'Active';
      switch(status) {
        case 'Active':
          columns['Active'].push(emp);
          break;
        case 'Onboarding':
          columns['Onboarding'].push(emp);
          break;
        case 'Resigned':
          columns['Resigned'].push(emp);
          break;
        default:
          columns['Active'].push(emp);
      }
    });

    setEmployeeColumns(columns);
  }, [filteredEmployees]);

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading employees from Supabase...');
        console.log('Supabase URL:', supabase.supabaseUrl);
        console.log('Supabase Key exists:', !!supabase.supabaseKey);
        
        // Try different possible table names
        const possibleTableNames = [
          'Employee Directory',
          'employee_directory', 
          'employees',
          'Employees',
          'EmployeeDirectory'
        ];
        
        let employeesData = null;
        let employeesError = null;
        
        for (const tableName of possibleTableNames) {
          console.log(`Trying table: ${tableName}`);
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('full_name');
            
          if (!error && data) {
            console.log(`Successfully found table: ${tableName}`);
            employeesData = data;
            employeesError = error;
            break;
          } else {
            console.log(`Table ${tableName} not found or error:`, error);
          }
        }

        console.log('Supabase response:', { employeesData, employeesError });

        if (employeesError) {
          console.error('Employees error details:', {
            message: employeesError.message,
            details: employeesError.details,
            hint: employeesError.hint,
            code: employeesError.code
          });
          throw new Error(`Database error: ${employeesError.message || 'Unknown error'}`);
        }

        if (!employeesData) {
          throw new Error('No employee data found. Please check:\n1. Supabase connection is working\n2. "Employee Directory" table exists\n3. Table has data\n4. RLS policies allow read access');
        }

        if (employeesData.length === 0) {
          console.log('No employees found in database');
          setEmployees([]);
          setFilteredEmployees([]);
          return;
        }

        console.log('Successfully loaded employees:', employeesData.length);
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);

      } catch (err) {
        console.error('Error loading employees:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined
        });
        setError(err instanceof Error ? err : new Error('Failed to load employees'));
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // Filter employees
  useEffect(() => {
    let filtered = employees;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.official_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.job_title && emp.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Job type filter
    if (jobTypeFilter.length > 0) {
      filtered = filtered.filter(emp => 
        emp.job_title && jobTypeFilter.includes(emp.job_title.trim())
      );
    }

    // Employment type filter
    if (employmentTypeFilter.length > 0) {
      filtered = filtered.filter(emp => 
        emp.employment_type && employmentTypeFilter.includes(emp.employment_type.trim())
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(emp => 
        emp.status && statusFilter.includes(emp.status.trim())
      );
    }

    setFilteredEmployees(filtered);
  }, [employees, searchTerm, jobTypeFilter, employmentTypeFilter, statusFilter]);

  // Kanban view drag and drop handler
  const handleEmployeeDragEnd = (result: any) => {
    console.log('handleEmployeeDragEnd called with result:', result);
    const { source, destination } = result;
    
    if (!destination) {
      console.log('No destination, returning');
      return;
    }

    if (
      source.droppableId === destination.droppableId && 
      source.index === destination.index
    ) {
      return;
    }

    const newColumns = { ...employeeColumns };
    const [reorderedEmployee] = newColumns[source.droppableId].splice(source.index, 1);
    
    // Update the employee's status
    const updatedEmployee = { ...reorderedEmployee, status: destination.droppableId };
    newColumns[destination.droppableId].splice(destination.index, 0, updatedEmployee);

    setEmployeeColumns(newColumns);

    // Update employee status in database and local state
    const updateEmployeeStatus = async () => {
      try {
        const { error } = await supabase
          .from('Employee Directory')
          .update({ status: destination.droppableId })
          .eq('whalesync_postgres_id', reorderedEmployee.whalesync_postgres_id);
        
        if (error) throw error;
        
        // Update the employee in the main employees array
        setEmployees(prevEmployees => 
          prevEmployees.map(emp => 
            emp.whalesync_postgres_id === reorderedEmployee.whalesync_postgres_id
              ? { ...emp, status: destination.droppableId }
              : emp
          )
        );
        
        toast.success(`Employee status updated to ${destination.droppableId}`);
      } catch (error) {
        console.error('Error updating employee status:', error);
        toast.error('Failed to update employee status');
        
        // Revert the local state change if database update fails
        const revertColumns = { ...employeeColumns };
        const [revertEmployee] = revertColumns[destination.droppableId].splice(destination.index, 1);
        revertColumns[source.droppableId].splice(source.index, 0, reorderedEmployee);
        setEmployeeColumns(revertColumns);
      }
    };

    updateEmployeeStatus();
  };

  // Pagination handlers
  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage(Math.max(currentPage - 1, 1));
  const handleNextPage = () => setCurrentPage(Math.min(currentPage + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Employee action handlers
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.full_name.split(' ')[0] || '',
      lastName: employee.full_name.split(' ').slice(1).join(' ') || '',
      email: employee.official_email,
      jobTitle: employee.job_title || '',
      employmentType: employee.employment_type || 'Full-time',
      workMode: employee.work_mode || 'Office',
      status: employee.status,
      dateOfJoining: employee.date_of_joining || '',
      phone: employee.personal_contact_number || '',
      address: employee.current_address || ''
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.full_name}?`)) return;

    try {
      const { error } = await supabase
        .from('Employee Directory')
        .delete()
        .eq('whalesync_postgres_id', employee.whalesync_postgres_id);

      if (error) throw error;

      toast.success('Employee deleted successfully');
      
      // Refresh employees list
      const { data: updatedEmployees } = await supabase
        .from('Employee Directory')
        .select(`
          *,
          department:Departments(*)
        `)
        .order('full_name');

      setEmployees(updatedEmployees || []);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      employmentType: 'Full-time',
      workMode: 'Office',
      status: 'Active',
      dateOfJoining: '',
      phone: '',
      address: ''
    });
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const employeeData = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        official_email: formData.email,
        job_title: formData.jobTitle,
        employment_type: formData.employmentType,
        work_mode: formData.workMode,
        status: formData.status,
        date_of_joining: formData.dateOfJoining,
        personal_contact_number: formData.phone,
        current_address: formData.address
      };

      if (isEditing && selectedEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('Employee Directory')
          .update(employeeData)
          .eq('whalesync_postgres_id', selectedEmployee.whalesync_postgres_id);

        if (error) throw error;
        toast.success('Employee updated successfully');
      } else {
        // Create new employee
        const { error } = await supabase
          .from('Employee Directory')
          .insert(employeeData);

        if (error) throw error;
        toast.success('Employee added successfully');
      }

      setIsFormOpen(false);
      
      // Refresh employees list
      const { data: updatedEmployees } = await supabase
        .from('Employee Directory')
        .select(`
          *,
          department:Departments(*)
        `)
        .order('full_name');

      setEmployees(updatedEmployees || []);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    }
  };

  const handleClearFilters = () => {
    setJobTypeFilter([]);
    setEmploymentTypeFilter([]);
    setStatusFilter([]);
    setSearchTerm('');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-background dark:bg-background overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-shrink-0">
              <SiteHeader title="Employees" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto animate-spin border-2 border-muted border-t-primary rounded-full"></div>
                <p className="mt-4 text-muted-foreground">Loading employees...</p>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen bg-background dark:bg-background overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-shrink-0">
              <SiteHeader title="Employees" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-2xl mx-auto p-6">
                <div className="h-12 w-12 mx-auto text-red-500 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Database Connection Error</h3>
                <p className="text-muted-foreground mb-4">{error.message}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => window.location.reload()}>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background dark:bg-background overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header - Fixed */}
          <div className="flex-shrink-0">
            <SiteHeader title="Employees" />
          </div>
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden px-4 pt-4 pb-4">
            {/* Statistics Cards */}
            <EmployeeStatisticsCards stats={stats} />

            {/* Search and Filters - Fixed */}
            <EmployeeFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              jobTypeFilter={jobTypeFilter}
              setJobTypeFilter={setJobTypeFilter}
              employmentTypeFilter={employmentTypeFilter}
              setEmploymentTypeFilter={setEmploymentTypeFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              view={view}
              setView={setView}
              employees={employees}
              onClearFilters={handleClearFilters}
              onAddEmployee={handleAddEmployee}
            />
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-card border-x border-border dark:border-border shadow-sm">
              {view === 'list' ? (
                <EmployeeListView
                  employees={paginatedEmployees}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onViewEmployee={handleViewEmployee}
                  onEditEmployee={handleEditEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                />
              ) : view === 'grid' ? (
                <EmployeeGridView
                  employees={paginatedEmployees}
                  onViewEmployee={handleViewEmployee}
                  onEditEmployee={handleEditEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                />
              ) : (
                <EmployeeKanbanView
                  employeeColumns={employeeColumns}
                  onDragEnd={handleEmployeeDragEnd}
                  onViewEmployee={handleViewEmployee}
                  onEditEmployee={handleEditEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                />
              )}
            </div>

            {/* Pagination - Fixed at Bottom */}
            <EmployeePagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalEmployees={filteredEmployees.length}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
            />

            {/* Employee Form Modal */}
            <EmployeeForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      </SidebarProvider>

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        employeeId={selectedEmployee ? selectedEmployee.whalesync_postgres_id : null}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedEmployee(null);
        }}
      />
    </div>
  );
}