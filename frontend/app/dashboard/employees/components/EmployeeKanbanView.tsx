"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GripVertical, Eye, Edit2, Trash2 } from "lucide-react";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult,
  DroppableProvided,
  DraggableProvided
} from "@hello-pangea/dnd";
import { useState, useEffect } from "react";

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

interface EmployeeKanbanViewProps {
  employeeColumns: {
    [key: string]: Employee[];
  };
  onDragEnd: (result: DropResult) => void;
  onViewEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
}

export default function EmployeeKanbanView({
  employeeColumns,
  onDragEnd,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee
}: EmployeeKanbanViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Onboarding':
        return 'bg-yellow-500';
      case 'Resigned':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDragEnd = (result: any) => {
    console.log('Drag end result:', result);
    onDragEnd(result);
  };

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {Object.entries(employeeColumns).map(([status, employees]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getColumnColor(status)}`}></div>
              <h3 className="font-semibold text-lg">
                {status} ({employees.length})
              </h3>
            </div>
            <div className="space-y-3 min-h-[400px]">
              {employees.map((employee) => (
                <Card key={employee.whalesync_postgres_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="cursor-grab">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.profile_photo} />
                            <AvatarFallback>
                              {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm">{employee.full_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {employee.job_title || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground truncate">
                          {employee.official_email}
                        </p>
                        {employee.department && (
                          <p className="text-xs text-muted-foreground">
                            {employee.department.department_name}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          {employee.employment_type || 'N/A'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewEmployee(employee)}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditEmployee(employee)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteEmployee(employee)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {Object.entries(employeeColumns).map(([status, employees]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getColumnColor(status)}`}></div>
              <h3 className="font-semibold text-lg">
                {status} ({employees.length})
              </h3>
            </div>
            
            <Droppable droppableId={status}>
              {(provided: DroppableProvided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 min-h-[400px]"
                >
                  {employees.map((employee, index) => (
                    <Draggable
                      key={employee.whalesync_postgres_id}
                      draggableId={employee.whalesync_postgres_id}
                      index={index}
                    >
                      {(provided: DraggableProvided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical 
                                      className="h-4 w-4 text-muted-foreground" 
                                    />
                                  </div>
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={employee.profile_photo} />
                                    <AvatarFallback>
                                      {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <Badge className={getStatusColor(employee.status)}>
                                  {employee.status}
                                </Badge>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-sm">{employee.full_name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {employee.job_title || 'N/A'}
                                </p>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground truncate">
                                  {employee.official_email}
                                </p>
                                {employee.department && (
                                  <p className="text-xs text-muted-foreground">
                                    {employee.department.department_name}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-xs text-muted-foreground">
                                  {employee.employment_type || 'N/A'}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onViewEmployee(employee)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditEmployee(employee)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDeleteEmployee(employee)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
