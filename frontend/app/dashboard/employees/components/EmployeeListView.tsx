"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Edit2, 
  Trash2, 
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  job_title?: string;
  employment_type?: string;
  status: string;
  official_email: string;
  personal_contact_number?: string;
  profile_photo?: string;
  department?: {
    department_name: string;
  } | null;
}

interface EmployeeListViewProps {
  employees: Employee[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
}

export default function EmployeeListView({
  employees,
  sortColumn,
  sortDirection,
  onSort,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee
}: EmployeeListViewProps) {
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Onboarding':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resigned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group"
              onClick={() => onSort('full_name')}
            >
              <div className="flex items-center group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-150">
                Name
                {getSortIcon('full_name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group"
              onClick={() => onSort('job_title')}
            >
              <div className="flex items-center group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-150">
                Job Title
                {getSortIcon('job_title')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group"
              onClick={() => onSort('employment_type')}
            >
              <div className="flex items-center group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-150">
                Employment Type
                {getSortIcon('employment_type')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-150">
                Status
                {getSortIcon('status')}
              </div>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.whalesync_postgres_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 group">
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3 group-hover:translate-x-1 transition-transform duration-150">
                  <Avatar className="h-8 w-8 group-hover:ring-2 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-150">
                    <AvatarImage src={employee.profile_photo} />
                    <AvatarFallback>
                      {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-150">{employee.full_name}</span>
                </div>
              </TableCell>
              <TableCell>{employee.job_title || 'N/A'}</TableCell>
              <TableCell>{employee.employment_type || 'N/A'}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(employee.status)} group-hover:scale-105 transition-transform duration-150`}>
                  {employee.status}
                </Badge>
              </TableCell>
              <TableCell>{employee.official_email}</TableCell>
              <TableCell>{employee.personal_contact_number || 'N/A'}</TableCell>
              <TableCell>{employee.department?.department_name || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => onViewEmployee(employee)} className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="bg-black text-white">
                        <p>View details</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => onEditEmployee(employee)} className="h-8 w-8 p-0">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="bg-black text-white">
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => onDeleteEmployee(employee)} className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" className="bg-black text-white">
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
