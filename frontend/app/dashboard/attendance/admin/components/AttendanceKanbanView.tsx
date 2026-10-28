"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface AttendanceRecord {
  id: string;
  employee_name: string;
  employee_id: string;
  job_title: string;
  date: string;
  status: string;
  time_in: string;
  time_out: string;
  working_hours: number;
  punctuality_status: string;
  marked_by: string;
  marked_at: string;
  notes: string;
}

interface AttendanceKanbanViewProps {
  paginatedData: AttendanceRecord[];
  onDragEnd: (result: any) => void;
  onViewRecord: (record: AttendanceRecord) => void;
  onEditRecord: (record: AttendanceRecord) => void;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  filteredDataLength: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export function AttendanceKanbanView({
  paginatedData,
  onDragEnd,
  onViewRecord,
  onEditRecord,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  filteredDataLength,
  itemsPerPage,
  onItemsPerPageChange
}: AttendanceKanbanViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-green-100 text-green-800 rounded-full">Present</Badge>;
      case 'Absent':
        return <Badge className="bg-red-100 text-red-800 rounded-full">Absent</Badge>;
      case 'Half Day':
        return <Badge className="bg-yellow-100 text-yellow-800 rounded-full">Half Day</Badge>;
      case 'Holiday':
        return <Badge className="bg-purple-100 text-purple-800 rounded-full">Holiday</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 rounded-full">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1 overflow-y-auto border rounded-md">
        <div className="p-0">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Present", "Absent", "Half Day", "Holiday"].map(status => {
                const statusRecords = paginatedData.filter(record => record.status === status);
                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{status}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {statusRecords.length}
                      </Badge>
                    </div>
                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 min-h-[200px] p-2 rounded-lg transition-colors ${
                            snapshot.isDraggingOver ? 'bg-muted/50' : ''
                          }`}
                        >
                          {statusRecords.map((record, index) => (
                            <Draggable key={record.id} draggableId={record.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-transform ${
                                    snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                  }`}
                                >
                                  <Card className="p-3 cursor-move hover:shadow-md transition-shadow rounded-none">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-sm">{record.employee_name}</p>
                                          <p className="text-xs text-muted-foreground">{record.employee_id}</p>
                                        </div>
                                        {getStatusBadge(record.status)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        <p>Job Title: {record.job_title}</p>
                                        <p>Date: {record.date}</p>
                                        {record.time_in && <p>Time In: {record.time_in}</p>}
                                        {record.time_out && <p>Time Out: {record.time_out}</p>}
                                        {record.working_hours && <p>Hours: {record.working_hours}h</p>}
                                      </div>
                                      <div className="flex gap-1 pt-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="rounded-none h-7 px-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onViewRecord(record);
                                          }}
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="rounded-none h-7 px-2"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onEditRecord(record);
                                          }}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </div>
    
      {/* Kanban Pagination - Outside Kanban */}
      {filteredDataLength > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t bg-background -mb-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredDataLength)} of {filteredDataLength} records
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFirstPage}
              disabled={currentPage === 1}
              className="rounded-none"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="rounded-none"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="rounded-none"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLastPage}
              disabled={currentPage === totalPages}
              className="rounded-none"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
