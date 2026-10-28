"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Edit2, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Building
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

interface EmployeeGridViewProps {
  employees: Employee[];
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
}

export default function EmployeeGridView({
  employees,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee
}: EmployeeGridViewProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {employees.map((employee) => (
        <Card key={employee.whalesync_postgres_id} className="hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-200 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 group-hover:ring-2 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all duration-200">
                  <AvatarImage src={employee.profile_photo} />
                  <AvatarFallback>
                    {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{employee.full_name}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">{employee.job_title || 'N/A'}</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(employee.status)} group-hover:scale-105 transition-transform duration-200`}>
                {employee.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{employee.official_email}</span>
              </div>
              {employee.personal_contact_number && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.personal_contact_number}</span>
                </div>
              )}
              {employee.department && (
                <div className="flex items-center space-x-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.department.department_name}</span>
                </div>
              )}
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {employee.employment_type || 'N/A'}
                </span>
                <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewEmployee(employee)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors duration-150"
                    title="View Employee"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEmployee(employee)}
                    className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-colors duration-150"
                    title="Edit Employee"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEmployee(employee)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                    title="Delete Employee"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
