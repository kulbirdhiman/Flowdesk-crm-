"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Import components
import TaskStatisticsCards from "./components/TaskStatisticsCards";
import TaskFilters from "./components/TaskFilters";
import TaskKanbanView from "./components/TaskKanbanView";
import TaskTableView from "./components/TaskTableView";
import TaskCalendarView from "./components/TaskCalendarView";
import EditTaskModal from "./components/EditTaskModal";
import CreateTaskModal from "./components/CreateTaskModal";
import ShareTaskModal from "./components/ShareTaskModal";
import TaskDetailsModal from "./components/TaskDetailsModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assignee?: string;
  created_at?: string;
  updated_at?: string;
  completed_on?: string;
  is_overdue?: boolean;
  days_overdue?: number;
  update_count?: number;
  attachments?: Array<{
    name: string;
    path: string;
    size: number;
    type: string;
  }>;
}

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Edit task states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });
  const [editAttachments, setEditAttachments] = useState<File[]>([]);
  
  // Task assignment states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    assignee: "",
  });
  const [createAttachments, setCreateAttachments] = useState<File[]>([]);
  
  // Task sharing states
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [sharingTask, setSharingTask] = useState<Task | null>(null);
  const [shareForm, setShareForm] = useState({
    assignee: "",
    message: "",
  });
  const [shareAttachments, setShareAttachments] = useState<File[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState("kanban");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadCurrentUser();
      loadEmployees();
    }
  }, [isClient]);

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current auth user:", user);
      console.log("User metadata:", user.user_metadata);
      console.log("User app metadata:", user.app_metadata);
      if (user) {
        setCurrentUserId(user.id);
        console.log("Searching for employee with user ID:", user.id);
        console.log("User email:", user.email);
        
        // First get the user record from Users table
        const { data: userRecord, error: userError } = await supabase
          .from("Users")
          .select("employee")
          .eq("email", user.email)
          .single();
          
        console.log("User record query result:", { userRecord, userError });
          
        if (userError) {
          console.log("No user record found in Users table (this is expected for demo users)");
          console.log("User error details:", userError);
          
          // This is not an error - just means the user is not in the Users table
          // We'll use the fallback approach
        }
        
        if (!userRecord?.employee) {
          console.log("No employee record found for user");

        }
        
        // Try multiple methods to find the employee record
        let employeeFound = false;
        
        // Method 1: Try to find by email in personal_email or official_email
        console.log("Method 1: Trying to find employee record by email...");
        const { data: employeeByEmail } = await supabase
          .from("Employee Directory")
          .select("whalesync_postgres_id, full_name")
          .or(`personal_email.eq.${user.email},official_email.eq.${user.email}`)
          .single();
          
        if (employeeByEmail) {
          console.log("✅ Found employee by email:", employeeByEmail);
          loadTasks(employeeByEmail.whalesync_postgres_id);
          employeeFound = true;
        }
        
        // Method 2: Try to find by name from user metadata
        if (!employeeFound && user.user_metadata?.full_name) {
          console.log("Method 2: Trying to find employee by full name from metadata...");
          const { data: employeeByName } = await supabase
            .from("Employee Directory")
            .select("whalesync_postgres_id, full_name")
            .ilike("full_name", `%${user.user_metadata.full_name}%`)
            .single();
            
          if (employeeByName) {
            console.log("✅ Found employee by name:", employeeByName);
            loadTasks(employeeByName.whalesync_postgres_id);
            employeeFound = true;
          }
        }
        
        // Method 3: Try to find by email prefix (username part)
        if (!employeeFound) {
          console.log("Method 3: Trying to find employee by email prefix...");
          const emailPrefix = user.email?.split('@')[0];
          const { data: employeeByPrefix } = await supabase
            .from("Employee Directory")
            .select("whalesync_postgres_id, full_name")
            .ilike("full_name", `%${emailPrefix}%`)
            .single();
            
          if (employeeByPrefix) {
            console.log("✅ Found employee by email prefix:", employeeByPrefix);
            loadTasks(employeeByPrefix.whalesync_postgres_id);
            employeeFound = true;
          }
        }
        
        // Method 4: For demo purposes, show all available employees
        if (!employeeFound) {
          console.log("Method 4: No employee found, showing available employees...");
          const { data: allEmployees } = await supabase
            .from("Employee Directory")
            .select("whalesync_postgres_id, full_name, personal_email, official_email")
            .limit(10);
            
          console.log("Available employees:", allEmployees);
          
          // For demo, let's use the first employee as a fallback
          if (allEmployees && allEmployees.length > 0) {
            console.log("Using first employee as demo fallback:", allEmployees[0]);
            loadTasks(allEmployees[0].whalesync_postgres_id);
          } else {
            console.log("No employees found in database");
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error loading current user:", error);
      toast.error(`Failed to load user: ${error.message}`);
      setLoading(false);
    }
  };

  const loadTasks = async (userId: string) => {
    try {
      console.log("Loading tasks for user ID:", userId);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("assignee", userId)
        .order("created_at", { ascending: false });

      console.log("Tasks query result:", { data, error });
      if (error) throw error;
      setTasks(data || []);
      console.log("Tasks loaded:", data?.length || 0);
    } catch (error: any) {
      console.error("Error loading tasks:", error);
      toast.error(`Failed to load tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name, profile_photo")
        .order("full_name");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      console.error("Error loading employees:", error);
      toast.error(`Failed to load employees: ${error.message}`);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      
      if (newStatus === "completed") {
        updateData.completed_on = new Date().toISOString();
      }

      const { error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", taskId);

      if (error) throw error;

      // Update local state instead of reloading
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, ...updateData } : task
        )
      );

      toast.success("Task status updated!");
    } catch (error: any) {
      console.error("Error updating task status:", error);
      toast.error(`Failed to update task: ${error.message}`);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      due_date: task.due_date || "",
    });
    setEditAttachments([]);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    try {
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        due_date: editForm.due_date || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", editingTask.id);

      if (error) throw error;

      // Upload files if any
      if (editAttachments.length > 0) {
        try {
          const uploadedFiles = await uploadFilesToSupabase(editAttachments, editingTask.id);
          
          if (uploadedFiles.length > 0) {
            // Update task with attachments
            const { error: updateError } = await supabase
              .from("tasks")
              .update({ attachments: uploadedFiles })
              .eq("id", editingTask.id);
            
            if (updateError) {
              console.error("Error updating task with attachments:", {
                error: updateError,
                errorString: JSON.stringify(updateError),
                errorMessage: updateError?.message,
                errorCode: updateError?.code,
                errorDetails: updateError?.details,
                errorHint: updateError?.hint
              });
              toast.error(`Failed to update task attachments: ${updateError.message || updateError.code || 'Unknown error'}`);
            } else {
              console.log("Successfully updated task with attachments:", uploadedFiles);
            }
          }
        } catch (uploadError: any) {
          console.error("Error in file upload process:", {
            error: uploadError,
            errorString: JSON.stringify(uploadError),
            errorMessage: uploadError?.message,
            stack: uploadError?.stack
          });
          toast.error(`Failed to upload files: ${uploadError?.message || 'Unknown upload error'}`);
        }
      }

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id ? { ...task, ...updateData } : task
        )
      );

      setIsEditDialogOpen(false);
      setEditingTask(null);
      setEditForm({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
      });
      setEditAttachments([]);
      toast.success("Task updated successfully!");
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast.error(`Failed to update task: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingTask(null);
    setEditForm({
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
    });
    setEditAttachments([]);
  };

  const handleCreateTask = () => {
    setCreateForm({
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
      assignee: "",
    });
    setCreateAttachments([]);
    setIsCreateDialogOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!createForm.title || !createForm.assignee) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newTask = {
        title: createForm.title,
        description: createForm.description,
        priority: createForm.priority,
        due_date: createForm.due_date || null,
        assignee: createForm.assignee,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;

      // Upload files if any
      if (createAttachments.length > 0) {
        try {
          const uploadedFiles = await uploadFilesToSupabase(createAttachments, data.id);
          
          if (uploadedFiles.length > 0) {
            // Update task with attachments
            const { error: updateError } = await supabase
              .from("tasks")
              .update({ attachments: uploadedFiles })
              .eq("id", data.id);
            
            if (updateError) {
              console.error("Error updating task with attachments:", {
                error: updateError,
                errorString: JSON.stringify(updateError),
                errorMessage: updateError?.message,
                errorCode: updateError?.code,
                errorDetails: updateError?.details,
                errorHint: updateError?.hint
              });
              toast.error(`Failed to update task attachments: ${updateError.message || updateError.code || 'Unknown error'}`);
            } else {
              console.log("Successfully updated task with attachments:", uploadedFiles);
            }
          }
        } catch (uploadError: any) {
          console.error("Error in file upload process:", {
            error: uploadError,
            errorString: JSON.stringify(uploadError),
            errorMessage: uploadError?.message,
            stack: uploadError?.stack
          });
          toast.error(`Failed to upload files: ${uploadError?.message || 'Unknown upload error'}`);
        }
      }

      // Add to local state
      setTasks(prevTasks => [data, ...prevTasks]);

      setIsCreateDialogOpen(false);
      setCreateForm({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assignee: "",
      });
      setCreateAttachments([]);
      toast.success("Task created successfully!");
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error(`Failed to create task: ${error.message}`);
    }
  };

  const handleCancelCreate = () => {
    setIsCreateDialogOpen(false);
    setCreateForm({
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
      assignee: "",
    });
    setCreateAttachments([]);
  };

  const handleShareTask = (task: Task) => {
    setSharingTask(task);
    setShareForm({
      assignee: "",
      message: "",
    });
    setShareAttachments([]);
    setIsShareDialogOpen(true);
  };

  const handleSaveShare = async () => {
    if (!sharingTask || !shareForm.assignee) {
      toast.error("Please select an employee to share with");
      return;
    }

    try {
      const sharedTask = {
        title: sharingTask.title,
        description: sharingTask.description,
        priority: sharingTask.priority,
        due_date: sharingTask.due_date,
        assignee: shareForm.assignee,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        shared_from: sharingTask.id, // Track the original task
        share_message: shareForm.message,
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert([sharedTask])
        .select()
        .single();

      if (error) throw error;

      // Upload files if any
      if (shareAttachments.length > 0) {
        try {
          const uploadedFiles = await uploadFilesToSupabase(shareAttachments, data.id);
          
          if (uploadedFiles.length > 0) {
            // Update task with attachments
            const { error: updateError } = await supabase
              .from("tasks")
              .update({ attachments: uploadedFiles })
              .eq("id", data.id);
            
            if (updateError) {
              console.error("Error updating shared task with attachments:", {
                error: updateError,
                errorString: JSON.stringify(updateError),
                errorMessage: updateError?.message,
                errorCode: updateError?.code,
                errorDetails: updateError?.details,
                errorHint: updateError?.hint
              });
              toast.error(`Failed to update shared task attachments: ${updateError.message || updateError.code || 'Unknown error'}`);
            } else {
              console.log("Successfully updated shared task with attachments:", uploadedFiles);
            }
          }
        } catch (uploadError: any) {
          console.error("Error in file upload process:", {
            error: uploadError,
            errorString: JSON.stringify(uploadError),
            errorMessage: uploadError?.message,
            stack: uploadError?.stack
          });
          toast.error(`Failed to upload files: ${uploadError?.message || 'Unknown upload error'}`);
        }
      }

      setIsShareDialogOpen(false);
      setSharingTask(null);
      setShareForm({
        assignee: "",
        message: "",
      });
      setShareAttachments([]);
      toast.success("Task shared successfully!");
    } catch (error: any) {
      console.error("Error sharing task:", error);
      toast.error(`Failed to share task: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCancelShare = () => {
    setIsShareDialogOpen(false);
    setSharingTask(null);
    setShareForm({
      assignee: "",
      message: "",
    });
    setShareAttachments([]);
  };

  // File upload helper functions
  const handleFileUpload = (files: FileList | null, setAttachments: (files: File[]) => void) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) added successfully!`);
    }
  };

  const removeFile = (index: number, setAttachments: (files: File[]) => void) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToSupabase = async (files: File[], taskId: string) => {
    const uploadedFiles = [];
    const errors = [];
    
    // Debug Supabase client configuration
    console.log('Supabase client URL:', supabase.supabaseUrl);
    console.log('Supabase client key exists:', !!supabase.supabaseKey);
    
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        // Generate unique ID only on client side to avoid hydration issues
        let uniqueId: string;
        if (typeof window !== 'undefined' && crypto.randomUUID) {
          uniqueId = crypto.randomUUID();
        } else {
          // Fallback for server-side or older browsers
          uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        }
        const fileName = `${taskId}-${uniqueId}.${fileExt}`;
        const filePath = `task-attachments/${fileName}`;
        
        console.log(`Uploading file: ${file.name} to path: ${filePath}`);
        
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
        
        if (error) {
          console.error('Supabase storage error for file:', file.name, {
            error: error,
            errorString: JSON.stringify(error),
            errorMessage: error?.message,
            errorCode: error?.code,
            errorDetails: error?.details,
            errorHint: error?.hint
          });
          errors.push({
            fileName: file.name,
            error: error,
            errorMessage: error.message || error.code || 'Unknown storage error'
          });
          continue; // Skip this file and continue with others
        }
        
        console.log(`Successfully uploaded file: ${file.name}`);
        uploadedFiles.push({
          name: file.name,
          path: filePath,
          size: file.size,
          type: file.type
        });
      } catch (error: any) {
        console.error('Error uploading file:', file.name, {
          error: error,
          errorString: JSON.stringify(error),
          errorMessage: error?.message,
          stack: error?.stack
        });
        errors.push({
          fileName: file.name,
          error: error,
          errorMessage: error?.message || error?.toString() || 'Unknown error occurred'
        });
      }
    }
    
    // Show error summary if there were any errors
    if (errors.length > 0) {
      const errorSummary = errors.map(e => `${e.fileName}: ${e.errorMessage}`).join(', ');
      toast.error(`Some files failed to upload: ${errorSummary}`);
    }
    
    return uploadedFiles;
  };

  const downloadFile = async (file: { name: string; path: string; size: number; type: string }) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(file.path);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${file.name}`);
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast.error(`Failed to download ${file.name}: ${error.message}`);
    }
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find(task => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Find the task being moved
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    console.log("Drag end:", { taskId, currentStatus: task.status, newStatus });

    // If the status changed, update it
    if (task.status !== newStatus) {
      console.log("Status changed, updating task");
      handleUpdateStatus(taskId, newStatus);
    } else {
      console.log("Same status, no update needed");
      // No need to do anything for same-column moves
      // The task should remain visible in its current column
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Description', 'Priority', 'Status', 'Due Date'],
      ...filteredTasks.map(task => [
        task.title,
        task.description || '',
        task.priority,
        task.status,
        task.due_date ? new Date(task.due_date).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Tasks exported successfully!");
  };

  // Reset pagination when filters/sorting change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, priorityFilter, dateFilter, sortField, sortDirection]);

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setPriorityFilter([]);
    setDateFilter([]);
  };

  // Filter and sort tasks based on search, filters, and sorting
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
    
    let matchesDate = true;
    if (dateFilter.length > 0 && task.due_date) {
      const taskDate = new Date(task.due_date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      matchesDate = dateFilter.some(filter => {
        switch (filter) {
          case "today":
            return taskDate.toDateString() === today.toDateString();
          case "tomorrow":
            return taskDate.toDateString() === tomorrow.toDateString();
          case "this_week":
            return taskDate >= today && taskDate <= nextWeek;
          case "overdue":
            return taskDate < today;
          default:
            return false;
        }
      });
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  }).sort((a, b) => {
    if (!sortField) return 0;

    let aValue: any = a[sortField as keyof Task];
    let bValue: any = b[sortField as keyof Task];

    // Handle date sorting
    if (sortField === "due_date") {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    // Handle string sorting
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const pendingTasks = filteredTasks.filter(task => task.status === "pending");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in_progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");

  // Pagination
  const totalCount = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return filteredTasks.filter(task => task.due_date === dateString);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isOverdueDate = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  // Debug logging
  console.log("Tasks state:", { 
    totalTasks: tasks.length, 
    pending: pendingTasks.length, 
    inProgress: inProgressTasks.length, 
    completed: completedTasks.length 
  });

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 pb-2">
      {/* Header - Removed as requested */}

      {/* Statistics Cards */}
      <TaskStatisticsCards
        filteredTasks={filteredTasks}
        pendingTasks={pendingTasks}
        inProgressTasks={inProgressTasks}
        completedTasks={completedTasks}
      />

      {/* Filters */}
      <TaskFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleExport={handleExport}
        clearAllFilters={clearAllFilters}
        handleCreateTask={handleCreateTask}
      />

      {/* Main Content */}
      {viewMode === "kanban" && (
        <TaskKanbanView
          pendingTasks={pendingTasks}
          inProgressTasks={inProgressTasks}
          completedTasks={completedTasks}
          activeTask={activeTask}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          handleEditTask={handleEditTask}
          handleShareTask={handleShareTask}
          getPriorityColor={getPriorityColor}
          formatDate={formatDate}
          isOverdue={isOverdue}
        />
      )}

      {viewMode === "table" && (
        <>
          <div className="h-[calc(100vh-360px)] overflow-auto">
            <TaskTableView
              filteredTasks={paginatedTasks}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleEditTask={handleEditTask}
              handleShareTask={handleShareTask}
              getPriorityColor={getPriorityColor}
              formatDate={formatDate}
              isOverdue={isOverdue}
              onRowClick={(task) => handleTaskClick(task)}
            />
          </div>
          <div className="flex items-center justify-between mt-2 mb-0 pb-0">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} tasks
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="rows" className="text-sm">Rows</label>
              <select
                id="rows"
                className="h-8 w-[90px] bg-background border rounded"
                value={String(pageSize)}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                {[10,20,50,100].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(1)}>First</Button>
              <Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
              <div className="text-sm">Page {page} of {totalPages}</div>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={() => setPage(p => p+1)}>Next</Button>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={() => setPage(totalPages)}>Last</Button>
            </div>
          </div>
        </>
      )}

      {viewMode === "calendar" && (
        <TaskCalendarView
          currentDate={currentDate}
          navigateMonth={navigateMonth}
          getDaysInMonth={getDaysInMonth}
          getTasksForDate={getTasksForDate}
          isToday={isToday}
          isOverdue={isOverdueDate}
          handleTaskClick={handleTaskClick}
        />
      )}

      {/* Modals */}
      <EditTaskModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        editingTask={editingTask}
        editForm={editForm}
        setEditForm={setEditForm}
        editAttachments={editAttachments}
        setEditAttachments={setEditAttachments}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        handleFileUpload={handleFileUpload}
        removeFile={removeFile}
      />

      <CreateTaskModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        createForm={createForm}
        setCreateForm={setCreateForm}
        createAttachments={createAttachments}
        setCreateAttachments={setCreateAttachments}
        employees={employees}
        handleSaveCreate={handleSaveCreate}
        handleCancelCreate={handleCancelCreate}
        handleFileUpload={handleFileUpload}
        removeFile={removeFile}
      />

      <ShareTaskModal
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        sharingTask={sharingTask}
        shareForm={shareForm}
        setShareForm={setShareForm}
        shareAttachments={shareAttachments}
        setShareAttachments={setShareAttachments}
        employees={employees}
        handleSaveShare={handleSaveShare}
        handleCancelShare={handleCancelShare}
        handleFileUpload={handleFileUpload}
        removeFile={removeFile}
      />

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        getPriorityColor={getPriorityColor}
        formatDate={formatDate}
        downloadFile={downloadFile}
      />
    </div>
  );
}