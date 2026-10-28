"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Table as TableIcon, Calendar as CalendarIcon2 } from "lucide-react";
import { toast } from "sonner";
import EmployeeInfoCard from "./components/EmployeeInfoCard";
import DeviceStatusCard from "./components/DeviceStatusCard";
import CurrentTimeCard from "./components/CurrentTimeCard";
import TodaysAttendanceTab from "./components/TodaysAttendanceTab";
import AttendanceHistoryTab from "./components/AttendanceHistoryTab";
import CalendarViewTab from "./components/CalendarViewTab";
import { AttendanceRecord, EmployeeInfo, DeviceInfo } from "./components/types";
import { calculateStatus, calculateWorkingHours, checkForOvertime, parseTimeToNumber, isDevicePC } from "./components/utils";

export default function EmployeeAttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isPC: false,
    isCompanyWifi: false,
    ipAddress: ''
  });
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    id: '',
    name: '',
    isTechTeam: false,
    photo: ''
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check device restrictions only
  useEffect(() => {
    const checkDevice = () => {
      const isPC = isDevicePC();
      
      setDeviceInfo({ isPC, isCompanyWifi: true, ipAddress: 'Any Network' });
      
      if (!isPC) {
        toast.error("Attendance can only be marked from PC/laptop");
        return;
      }
    };

    checkDevice();
  }, []);

  // Load employee info and today's attendance
  useEffect(() => {
    loadEmployeeInfo();
  }, []);

  // Ensure employee data is available for attendance marking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoadingEmployee && !employeeInfo.name) {
        console.log('Setting fallback employee data for attendance marking...');
        setEmployeeInfo({
          id: 'employee-' + Date.now(),
          name: 'Employee',
          isTechTeam: false,
          photo: ''
        });
        setIsLoadingEmployee(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoadingEmployee, employeeInfo.name]);

  // Load attendance when employee info is available
  useEffect(() => {
    if (employeeInfo.id) {
      loadTodayAttendance();
      loadAttendanceHistory();
    }
  }, [employeeInfo.id]);

  const loadEmployeeInfo = async () => {
    setIsLoadingEmployee(true);
    console.log('Loading employee info...');
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }

      if (!user?.email) {
        console.log('No authenticated user found');
        throw new Error('No authenticated user');
      }

      console.log('Authenticated user email:', user.email);

      const { data: employee, error: employeeError } = await supabase
        .from('Employee Directory')
        .select('whalesync_postgres_id, full_name, job_title, official_email, profile_photo, employment_type, work_mode')
        .eq('official_email', user.email)
        .single();

      console.log('Employee query result:', { employee, employeeError });

      if (employeeError) {
        console.error('Error finding employee:', employeeError);
        const employeeName = user.email.split('@')[0];
        const capitalizedName = employeeName.charAt(0).toUpperCase() + employeeName.slice(1);
        
        console.log('Using fallback employee info:', {
          email: user.email,
          name: capitalizedName
        });

        setEmployeeInfo({
          id: 'employee-' + Date.now(),
          name: capitalizedName,
          isTechTeam: false,
          photo: ''
        });
      } else if (employee) {
        console.log('Found employee in database:', employee);
        setEmployeeInfo({
          id: employee.whalesync_postgres_id,
          name: employee.full_name || user.email.split('@')[0],
          isTechTeam: employee.job_title?.toLowerCase().includes('tech') || 
                     employee.job_title?.toLowerCase().includes('developer') ||
                     employee.job_title?.toLowerCase().includes('engineer') ||
                     false,
          photo: employee.profile_photo || ''
        });
      }

      setIsLoadingEmployee(false);
    } catch (error) {
      console.error('Error loading employee info:', error);
      console.log('Using fallback employee due to error');
      setEmployeeInfo({
        id: 'employee-' + Date.now(),
        name: 'Employee',
        isTechTeam: false,
        photo: ''
      });
      setIsLoadingEmployee(false);
    }
  };

  const loadTodayAttendance = async () => {
    try {
      if (!employeeInfo.id) {
        console.log('No employee ID available for today\'s attendance');
        setAttendance(null);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      console.log('Loading today\'s attendance for employee:', employeeInfo.id, 'date:', today);
      
      const localAttendance = localStorage.getItem('offline-attendance');
      if (localAttendance) {
        try {
          const parsedAttendance = JSON.parse(localAttendance);
          if (parsedAttendance.date === today) {
            console.log('Found today\'s attendance in localStorage:', parsedAttendance);
            setAttendance(parsedAttendance);
            return;
          }
        } catch (parseError) {
          console.log('Error parsing localStorage attendance:', parseError);
        }
      }

      try {
        const { data: attendanceData, error } = await supabase
          .from('Attendance')
          .select('*')
          .eq('employee', employeeInfo.id)
          .eq('date', today)
          .maybeSingle();

        if (error) {
          console.error('Error loading today\'s attendance from database:', error);
          console.log('No attendance found for today');
          setAttendance(null);
          return;
        }

        if (attendanceData) {
          console.log('Today\'s attendance loaded from database:', attendanceData);
          setAttendance(attendanceData);
        } else {
          console.log('No attendance found for today');
          setAttendance(null);
        }
      } catch (dbError) {
        console.error('Database error, using localStorage fallback:', dbError);
        console.log('No attendance found for today');
        setAttendance(null);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      console.log('Setting attendance to null due to catch error');
      setAttendance(null);
    }
  };

  const loadAttendanceHistory = async () => {
    if (!employeeInfo.id) {
      console.log('No employee ID available for attendance history');
      setAttendanceHistory([]);
      setIsLoadingHistory(false);
      return;
    }
    
    setIsLoadingHistory(true);
    try {
      console.log('Loading attendance history for employee:', employeeInfo.id);
      
      const localAttendance = localStorage.getItem('offline-attendance');
      if (localAttendance) {
        try {
          const parsedAttendance = JSON.parse(localAttendance);
          console.log('Found attendance in localStorage:', parsedAttendance);
          setAttendanceHistory([parsedAttendance]);
          setIsLoadingHistory(false);
          return;
        } catch (parseError) {
          console.log('Error parsing localStorage attendance:', parseError);
        }
      }

      try {
        const { data, error } = await supabase
          .from('Attendance')
          .select('*')
          .eq('employee', employeeInfo.id)
          .order('date', { ascending: false })
          .limit(30);

        if (error) {
          console.error('Error loading attendance history from database:', error);
          console.log('No attendance history found');
          setAttendanceHistory([]);
          return;
        }

        console.log('Attendance history loaded from database:', data?.length || 0, 'records');
        setAttendanceHistory(data || []);
      } catch (dbError) {
        console.error('Database error, using localStorage fallback:', dbError);
        console.log('No attendance history found');
        setAttendanceHistory([]);
      }
    } catch (error) {
      console.error('Error loading attendance history:', error);
      console.log('Setting empty attendance history due to catch error');
      setAttendanceHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleCheckIn = async () => {
    if (!deviceInfo.isPC) {
      toast.error("Attendance can only be marked from PC/laptop");
      return;
    }

    if (attendance && attendance.time_in) {
      toast.error("You have already checked in today!");
      return;
    }

    if (!employeeInfo.id) {
      console.log('No employee ID, using temporary ID');
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      const today = now.toISOString().split('T')[0];
      
      const status = calculateStatus(currentTimeStr, employeeInfo.isTechTeam);
      
      const attendanceData = {
        employee: employeeInfo.id || 'employee-' + Date.now(),
        full_name_from_employee: employeeInfo.name || 'Employee',
        date: today,
        time_in: parseTimeToNumber(currentTimeStr),
        status: status,
        employee_id_from_employee: employeeInfo.id || 'employee-' + Date.now(),
        working_hours: 0
      };

      console.log('Saving attendance to localStorage:', attendanceData);

      try {
        const { data, error } = await supabase
          .from('Attendance')
          .insert(attendanceData)
          .select();

        if (error) {
          console.error('Database sync error:', error);
          localStorage.setItem('offline-attendance', JSON.stringify(attendanceData));
          toast.error(`Check-in saved locally. Database sync failed: ${error.message}`);
          return;
        }

        console.log('Attendance synced to database:', data);
        
        const updatedAttendanceData = {
          ...attendanceData,
          whalesync_postgres_id: data[0]?.whalesync_postgres_id
        };

        localStorage.setItem('offline-attendance', JSON.stringify(updatedAttendanceData));
        setAttendance(updatedAttendanceData);
        toast.success(`Check-in successful! Status: ${status} (Synced to database)`);
        console.log('Database sync successful - real-time update sent to admin');
        
      } catch (dbError) {
        console.error('Database sync error:', dbError);
        localStorage.setItem('offline-attendance', JSON.stringify(attendanceData));
        setAttendance(attendanceData);
        toast.error(`Check-in saved locally. Database sync failed: ${dbError.message}`);
      }
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error(`Failed to check in: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!attendance) return;

    if (attendance.time_out) {
      toast.error("You have already checked out today!");
      return;
    }

    if (!attendance.time_in) {
      toast.error("Please check in first before checking out!");
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      
      const workingHours = calculateWorkingHours(attendance.time_in, parseTimeToNumber(currentTimeStr), attendance.date);
      
      const checkOutTime = new Date(`${attendance.date}T${currentTimeStr}:00`);
      const isOvertime = checkForOvertime(checkOutTime, employeeInfo.isTechTeam, attendance.date);
      
      let finalStatus = attendance.status;
      if (isOvertime) {
        finalStatus = attendance.status + ' (Overtime)';
      }

      console.log('Updating attendance in localStorage:', {
        employee: attendance.employee,
        date: attendance.date,
        time_out: parseTimeToNumber(currentTimeStr),
        working_hours: Math.round(workingHours * 100) / 100,
        status: finalStatus
      });

      try {
        let data, error;

        if (attendance.whalesync_postgres_id) {
          const result = await supabase
            .from('Attendance')
            .update({
              time_out: parseTimeToNumber(currentTimeStr),
              working_hours: Math.round(workingHours * 100) / 100,
              status: finalStatus
            })
            .eq('whalesync_postgres_id', attendance.whalesync_postgres_id)
            .select();
          
          data = result.data;
          error = result.error;
        } else {
          const result = await supabase
            .from('Attendance')
            .update({
              time_out: parseTimeToNumber(currentTimeStr),
              working_hours: Math.round(workingHours * 100) / 100,
              status: finalStatus
            })
            .eq('employee', attendance.employee)
            .eq('date', attendance.date)
            .select();
          
          data = result.data;
          error = result.error;
        }

        if (error) {
          console.error('Database sync error:', error);
          const updatedAttendance = {
            ...attendance,
            time_out: parseTimeToNumber(currentTimeStr),
            working_hours: Math.round(workingHours * 100) / 100,
            status: finalStatus
          };
          localStorage.setItem('offline-attendance', JSON.stringify(updatedAttendance));
          setAttendance(updatedAttendance);
          toast.error(`Check-out saved locally. Database sync failed: ${error.message}`);
          return;
        }

        console.log('Attendance synced to database:', data);
        
        const updatedAttendance = {
          ...attendance,
          time_out: parseTimeToNumber(currentTimeStr),
          working_hours: Math.round(workingHours * 100) / 100,
          status: finalStatus
        };
        
        localStorage.setItem('offline-attendance', JSON.stringify(updatedAttendance));
        setAttendance(updatedAttendance);
        toast.success(`Check-out successful! Working hours: ${Math.round(workingHours * 100) / 100}h (Synced to database)`);
        console.log('Database sync successful - real-time update sent to admin');
        
      } catch (dbError) {
        console.error('Database sync error:', dbError);
        const updatedAttendance = {
          ...attendance,
          time_out: parseTimeToNumber(currentTimeStr),
          working_hours: Math.round(workingHours * 100) / 100,
          status: finalStatus
        };
        localStorage.setItem('offline-attendance', JSON.stringify(updatedAttendance));
        setAttendance(updatedAttendance);
        toast.error(`Check-out saved locally. Database sync failed: ${dbError.message}`);
      }
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error(`Failed to check out: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Employee Info & Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EmployeeInfoCard
            employeeInfo={employeeInfo}
            isLoading={isLoadingEmployee}
            onRefresh={loadEmployeeInfo}
          />
          <DeviceStatusCard deviceInfo={deviceInfo} />
          <CurrentTimeCard currentTime={currentTime} />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Today's Attendance
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              Attendance History
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon2 className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          {/* Today's Attendance Tab */}
          <TabsContent value="today" className="space-y-6">
            <TodaysAttendanceTab
              attendance={attendance}
              currentTime={currentTime}
              isLoading={isLoading}
              deviceInfo={deviceInfo}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          </TabsContent>

          {/* Attendance History Tab */}
          <TabsContent value="history" className="space-y-6">
            <AttendanceHistoryTab
              attendanceHistory={attendanceHistory}
              isLoading={isLoadingHistory}
            />
          </TabsContent>

          {/* Calendar View Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <CalendarViewTab
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}