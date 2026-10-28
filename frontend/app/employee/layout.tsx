"use client";

import { useState, useEffect } from "react";
import { EmployeeSidebar } from "@/components/employee/EmployeeSidebar";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PageProvider, usePageContext } from "@/contexts/PageContext";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { Loader2 } from "lucide-react";

function EmployeeLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const { subtitle, onRefresh } = usePageContext();

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/employee") return "Dashboard";
    if (pathname.includes("/leads/") && pathname.split("/").length > 3) return "Lead Details";
    if (pathname.includes("/new-leads")) return "New Leads";
    if (pathname.includes("/follow-up-leads")) return "Follow Up Leads";
    if (pathname.includes("/not-connected-leads")) return "Not Connected Leads";
    if (pathname.includes("/call-logs")) {
      if (pathname.includes("/incoming")) return "Incoming Calls";
      if (pathname.includes("/outgoing")) return "Outgoing Calls";
      if (pathname.includes("/missed")) return "Missed Calls";
      return "Call Logs";
    }
    if (pathname.includes("/tasks")) return "My Tasks";
    if (pathname.includes("/documents")) return "My Documents";
    if (pathname.includes("/tickets")) return "My Tickets";
    if (pathname.includes("/subscriptions")) return "My Subscriptions";
    if (pathname.includes("/attendance")) return "Mark Attendance";
    return "Employee Portal";
  };

  return (
    <>
      <AnnouncementBanner isAdmin={false} fixed={false} />
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className={`hidden md:block transition-all duration-300 ${desktopSidebarOpen ? 'w-64' : 'w-0'}`}>
          {desktopSidebarOpen && <EmployeeSidebar />}
        </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <EmployeeSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <EmployeeHeader
          title={getPageTitle()}
          subtitle={subtitle}
          onRefresh={onRefresh}
          onMenuClick={() => setSidebarOpen(true)}
          onDesktopSidebarToggle={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
          desktopSidebarOpen={desktopSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
    </>
  );
}

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isDemoPage = pathname.startsWith("/employee/demo");

  useEffect(() => {
    if (!loading && !isDemoPage) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "employee") {
        if (user.role === "admin") {
          router.push("/dashboard");
        } else if (user.role === "hr") {
          router.push("/dashboard/attendance/hr");
        }
      }
    }
  }, [user, loading, router, isDemoPage]);

  // Don't apply auth guard or sidebar to demo pages
  if (isDemoPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "employee") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <PageProvider>
      <EmployeeLayoutContent>{children}</EmployeeLayoutContent>
    </PageProvider>
  );
}

