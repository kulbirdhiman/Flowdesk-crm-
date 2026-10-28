"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Key, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Pause 
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Import components
import SubscriptionStatisticsCards from "./components/SubscriptionStatisticsCards";
import SubscriptionFilters from "./components/SubscriptionFilters";
import SubscriptionGridView from "./components/SubscriptionGridView";
import SubscriptionTableView from "./components/SubscriptionTableView";
import SubscriptionDetailsModal from "./components/SubscriptionDetailsModal";

interface Subscription {
  id: string;
  subscription_name: string;
  vendor_id?: string;
  plan_tier?: string;
  cost_per_period?: number;
  cost_per_user?: number;
  billing_cycle?: string;
  auto_renewal_status?: string;
  owner_id?: string;
  start_date?: string;
  expiry_date?: string;
  status?: string;
  notes?: string;
  portal_url?: string;
  category?: string;
  number_of_users?: number;
  created_at?: string;
  updated_at?: string;
  vendor?: {
    full_name: string;
    profile_photo?: string;
  };
  owner?: {
    full_name: string;
    profile_photo?: string;
    official_email?: string;
  };
  credentials?: {
    email?: string;
    password?: string;
  };
}

export default function EmployeeSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showColumnPopover, setShowColumnPopover] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    subscription: true,
    vendor: true,
    status: true,
    category: true,
    plan: true,
    billing: true,
    expires: true,
    actions: true
  });
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadSubscriptions();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;
      
      // Demo mode - allow without authentication if no user session exists (e.g. demo routes)
      const isDemoMode = !user;
      
      if (!user?.email) {
        if (!isDemoMode) {
          console.log("No user logged in");
          return;
        }
        // In demo mode, use the first employee with subscriptions
        console.log("Demo mode: No user logged in, using demo data");
      }

      let employeeUUID: string | null = null;

      if (user?.email) {
        // Get employee data by email
        const { data: employeeData, error: empError } = await supabase
          .from("Employee Directory")
          .select("whalesync_postgres_id, full_name, official_email")
          .eq("official_email", user.email)
          .single();

        if (empError || !employeeData) {
          console.error("Employee not found:", empError);
          if (isDemoMode) {
            // In demo mode, get an employee who has subscriptions
            const { data: employeeWithSubs } = await supabase
              .from("subscription_users")
              .select("user_id")
              .limit(1)
              .single();
            
            if (employeeWithSubs) {
              employeeUUID = employeeWithSubs.user_id;
              console.log("Demo mode: Using employee with subscriptions");
            }
          }
        } else {
          employeeUUID = employeeData.whalesync_postgres_id;
        }
      } else if (isDemoMode) {
        // No user in demo mode - get an employee who has subscriptions
        const { data: employeeWithSubs } = await supabase
          .from("subscription_users")
          .select("user_id")
          .limit(1)
          .single();
        
        if (employeeWithSubs) {
          employeeUUID = employeeWithSubs.user_id;
          console.log("Demo mode: Using employee with subscriptions for data");
        }
      }

      if (employeeUUID) {
        // Get full employee data
        const { data: employeeData } = await supabase
          .from("Employee Directory")
          .select("whalesync_postgres_id, full_name, official_email")
          .eq("whalesync_postgres_id", employeeUUID)
          .single();

        if (employeeData) {
          setCurrentUser(employeeData);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadSubscriptions = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Get subscriptions assigned to this employee
      const { data: subscriptionUsers, error: usersError } = await supabase
        .from("subscription_users")
        .select(`
          subscription_id,
          subscriptions (
            *,
            vendor:vendor_id(full_name, profile_photo),
            owner:owner_id(full_name, profile_photo, official_email),
            credentials(*)
          )
        `)
        .eq("user_id", currentUser.whalesync_postgres_id);

      if (usersError) {
        console.error("Error fetching subscription users:", usersError);
        throw usersError;
      }

      const userSubscriptions = subscriptionUsers?.map(su => ({
        ...su.subscriptions,
        credentials: su.subscriptions.credentials?.[0] || null
      })) || [];
      setSubscriptions(userSubscriptions);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (dateString: string | undefined) => {
    if (!dateString) return Infinity;
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Paused': return 'bg-yellow-500';
      case 'Inactive': return 'bg-gray-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'Inactive': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'Cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const togglePasswordVisibility = (subscriptionId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [subscriptionId]: !prev[subscriptionId]
    }));
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.subscription_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.vendor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(sub.status);
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(sub.category);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeSubscriptions = subscriptions.filter(s => s.status === 'Active');
  const renewalsSoon = activeSubscriptions.filter(s => {
    const days = getDaysUntilExpiry(s.expiry_date);
    return days <= 30 && days >= 0;
  }).length;

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const resetColumns = () => {
    setVisibleColumns({
      subscription: true,
      vendor: true,
      status: true,
      category: true,
      plan: true,
      billing: true,
      expires: true,
      actions: true
    });
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 text-foreground" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="h-4 w-4 text-foreground" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
  };

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    let aValue: any;
    let bValue: any;

    switch (sortColumn) {
      case "subscription":
        aValue = a.subscription_name?.toLowerCase() || "";
        bValue = b.subscription_name?.toLowerCase() || "";
        break;
      case "vendor":
        aValue = a.vendor?.full_name?.toLowerCase() || "";
        bValue = b.vendor?.full_name?.toLowerCase() || "";
        break;
      case "status":
        aValue = a.status?.toLowerCase() || "";
        bValue = b.status?.toLowerCase() || "";
        break;
      case "category":
        aValue = a.category?.toLowerCase() || "";
        bValue = b.category?.toLowerCase() || "";
        break;
      case "plan":
        aValue = a.plan_tier?.toLowerCase() || "";
        bValue = b.plan_tier?.toLowerCase() || "";
        break;
      case "billing":
        aValue = a.cost_per_period || 0;
        bValue = b.cost_per_period || 0;
        break;
      case "expires":
        aValue = new Date(a.expiry_date || "").getTime();
        bValue = new Date(b.expiry_date || "").getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: subscriptions.length,
    active: activeSubscriptions.length,
    renewalsSoon: renewalsSoon
  };

  return (
    <div className="space-y-6 px-2">
      {/* Statistics Cards */}
      <SubscriptionStatisticsCards stats={stats} />

      {/* Filters */}
      <SubscriptionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showColumnPopover={showColumnPopover}
        setShowColumnPopover={setShowColumnPopover}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        resetColumns={resetColumns}
      />

      {/* Subscriptions List */}
      {filteredSubscriptions.length > 0 ? (
        viewMode === 'grid' ? (
          <SubscriptionGridView
            subscriptions={sortedSubscriptions}
            onViewSubscription={setSelectedSubscription}
            showCredentials={showCredentials}
            onTogglePasswordVisibility={togglePasswordVisibility}
            onCopyToClipboard={copyToClipboard}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getDaysUntilExpiry={getDaysUntilExpiry}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        ) : (
          <SubscriptionTableView
            subscriptions={sortedSubscriptions}
            visibleColumns={visibleColumns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onViewSubscription={setSelectedSubscription}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Subscriptions Found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter.length > 0 || categoryFilter.length > 0
                ? "Try adjusting your filters to see more results."
                : "You haven't been assigned to any subscriptions yet. Contact your administrator for access."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Subscription Details Modal */}
      <SubscriptionDetailsModal
        subscription={selectedSubscription}
        isOpen={!!selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
        showCredentials={showCredentials}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onCopyToClipboard={copyToClipboard}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />
    </div>
  );
}
