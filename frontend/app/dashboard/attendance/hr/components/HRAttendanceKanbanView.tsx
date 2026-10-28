"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Edit 
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface HRAttendanceKanbanViewProps {
  paginatedData: any[];
  handleDragEnd: (result: any) => void;
  handleViewRecord: (record: any) => void;
  handleEditRecord: (record: any) => void;
  filteredData: any[];
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  currentPage: number;
  totalPages: number;
  handleFirstPage: () => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleLastPage: () => void;
  setIsTopPerformersOpen: (open: boolean) => void;
}

export default function HRAttendanceKanbanView({
  paginatedData,
  handleDragEnd,
  handleViewRecord,
  handleEditRecord,
  filteredData,
  startIndex,
  endIndex,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  totalPages,
  handleFirstPage,
  handlePrevPage,
  handleNextPage,
  handleLastPage,
  setIsTopPerformersOpen
}: HRAttendanceKanbanViewProps) {
  return (
    <div className="flex flex-col h-[60vh] font-sans">
      <div className="flex-1 overflow-y-auto border rounded-md bg-background">
        <div className="p-0 -mt-1">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 p-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Present Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-none shadow-sm">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold text-foreground text-sm">Present</span>
                    <Badge variant="secondary" className="ml-auto rounded-none">
                      {paginatedData.filter(record => record.status === 'Present').length}
                    </Badge>
                  </div>
                  <Droppable droppableId="Present">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-2 rounded-none transition-colors ${
                          snapshot.isDraggingOver ? 'bg-muted/50' : 'bg-muted/20'
                        }`}
                      >
                        {paginatedData
                          .filter(record => record.status === 'Present')
                          .map((record, index) => (
                            <Draggable key={record.id} draggableId={record.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 bg-card border border-border rounded-none shadow-sm mb-2 cursor-move hover:shadow-md transition-all ${
                                    snapshot.isDragging ? 'rotate-2 scale-105 shadow-lg' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-foreground text-sm">{record.employee_name}</div>
                                      <div className="text-xs text-muted-foreground">{record.department}</div>
                                      <div className="text-xs text-gray-400 mt-1">
                                        {record.time_in} - {record.time_out}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {record.working_hours}h worked
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0 rounded-none"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewRecord(record);
                                        }}
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0 rounded-none"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditRecord(record);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Absent Column */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-none shadow-sm">
                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold text-foreground text-sm">Absent</span>
                    <Badge variant="secondary" className="ml-auto rounded-none">
                      {paginatedData.filter(record => record.status === 'Absent').length}
                    </Badge>
                  </div>
                  <Droppable droppableId="Absent">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-2 rounded-none transition-colors ${
                          snapshot.isDraggingOver ? 'bg-muted/50' : 'bg-muted/20'
                        }`}
                      >
                        {paginatedData
                          .filter(record => record.status === 'Absent')
                          .map((record, index) => (
                            <Draggable key={record.id} draggableId={record.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 bg-card border border-border rounded-none shadow-sm mb-2 cursor-move hover:shadow-md transition-all ${
                                    snapshot.isDragging ? 'rotate-2 scale-105 shadow-lg' : ''
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-foreground text-sm">{record.employee_name}</div>
                                      <div className="text-xs text-muted-foreground">{record.department}</div>
                                      <div className="text-xs text-gray-400 mt-1">
                                        {record.date}
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0 rounded-none"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewRecord(record);
                                        }}
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0 rounded-none"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditRecord(record);
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>

              {/* Top Performers Icon */}
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 w-16 rounded-none border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  onClick={() => setIsTopPerformersOpen(true)}
                  title="Top Attendance Performers"
                >
                  <TrendingUp className="h-8 w-8 text-gray-600" />
                </Button>
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Pagination for Kanban */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t bg-background -mb-2">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="rounded-none"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
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
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded-none"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastPage}
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
