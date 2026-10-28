"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

// Import components
import SubscriptionKPICards from "./components/SubscriptionKPICards";
import SubscriptionSpendChart from "./components/SubscriptionSpendChart";
import SubscriptionRenewalsList from "./components/SubscriptionRenewalsList";
import SubscriptionFilters from "./components/SubscriptionFilters";
import SubscriptionTableView from "./components/SubscriptionTableView";
import SubscriptionKanbanView from "./components/SubscriptionKanbanView";
import SubscriptionDetailsView from "./components/SubscriptionDetailsView";
import CreateSubscriptionModal from "./components/CreateSubscriptionModal";
import ShareCredentialsModal from "./components/ShareCredentialsModal";

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
  users?: Array<{
    full_name: string;
    profile_photo?: string;
  }>;
  credentials?: {
    email?: string;
    password?: string;
  };
}

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
  profile_photo?: string;
  official_email?: string;
}

function SubscriptionsPageContent() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"dashboard" | "subscriptions" | "details">("dashboard");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState({
    subscription: true,
    plan: true,
    cost: true,
    users: true,
    annualCost: true,
    status: true,
    renewal: true,
    actions: true
  });
  const [showKanban, setShowKanban] = useState(false);
  const [shareCredentialsOpen, setShareCredentialsOpen] = useState(false);
  const [selectedSubscriptionForShare, setSelectedSubscriptionForShare] = useState<Subscription | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const [newSubscription, setNewSubscription] = useState({
    subscription_name: "",
    vendor_id: "",
    plan_tier: "Team Plan",
    cost_per_period: "",
    cost_per_user: "",
    billing_cycle: "Monthly",
    auto_renewal_status: "Enabled",
    owner_id: "",
    start_date: "",
    expiry_date: "",
    status: "Active",
    notes: "",
    portal_url: "",
    category: "",
    number_of_users: 0,
    selected_users: [] as string[],
    credentials: {
      email: "",
      password: ""
    }
  });

  const ALL_CATEGORIES = ['SaaS', 'Marketing', 'Cloud', 'Productivity', 'Security', 'Finance', 'Communication', 'Other', 'Job Portal'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load subscriptions with related data
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select(`
          *,
          vendor:vendor_id(full_name, profile_photo),
          owner:owner_id(full_name, profile_photo, official_email),
          subscription_users(
            user:user_id(full_name, profile_photo)
          ),
          credentials(*)
        `)
        .order("created_at", { ascending: false });

      if (subscriptionsError) throw subscriptionsError;

      // Transform the data to match our interface
      const transformedSubscriptions = subscriptionsData?.map(sub => ({
        ...sub,
        users: sub.subscription_users?.map((su: { user: { full_name: string; profile_photo?: string } }) => su.user).filter(Boolean) || [],
        credentials: sub.credentials?.[0] || null
      })) || [];

      setSubscriptions(transformedSubscriptions);

      // Load employees for dropdowns
      const { data: employeesData, error: employeesError } = await supabase
        .from("Employee Directory")
        .select("whalesync_postgres_id, full_name, profile_photo, official_email")
        .order("full_name");

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

    } catch (error: unknown) {
      console.error("Error loading data:", error);
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

  const calculateTotalAnnualCost = (sub: Subscription) => {
    const costPerUser = sub.cost_per_user || 0;
    const numUsers = sub.number_of_users || 0;
    const costPerPeriod = sub.cost_per_period || 0;
    const cycle = sub.billing_cycle;
    const cycleMap: { [key: string]: number } = { 
      'Monthly': 12, 
      'Quarterly': 4, 
      'Yearly': 1, 
      'Bi-Annual': 2, 
      'One-Time': 0 
    };
    const multiplier = cycleMap[cycle || ''] || 0;

    if (costPerUser > 0 && numUsers > 0) {
      return costPerUser * numUsers * multiplier;
    }
    return costPerPeriod * multiplier;
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

  const getCategoryColor = (index: number) => {
    const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-green-500', 'bg-yellow-500'];
    return colors[index % colors.length];
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleShareCredentials = async () => {
    if (!selectedSubscriptionForShare || selectedEmployees.length === 0) {
      toast.error("Please select employees to share credentials with");
      return;
    }

    try {
      // Create subscription-user relationships in the database
      const userInserts = selectedEmployees.map(userId => ({
        subscription_id: selectedSubscriptionForShare.id,
        user_id: userId
      }));

      const { error: usersError } = await supabase
        .from("subscription_users")
        .insert(userInserts);

      if (usersError) {
        console.error("Error inserting subscription users:", usersError);
        throw usersError;
      }

      // Also copy credentials to clipboard for immediate sharing
      const message = `Here are the credentials for ${selectedSubscriptionForShare.subscription_name}:\n\nEmail: ${selectedSubscriptionForShare.credentials?.email}\nPassword: ${selectedSubscriptionForShare.credentials?.password}\n\nPlease keep these secure.`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(message);
      
      toast.success(`Subscription shared with ${selectedEmployees.length} employee(s). They can now access it in their employee portal.`);
      
      setShareCredentialsOpen(false);
      setSelectedSubscriptionForShare(null);
      setSelectedEmployees([]);
      
      // Reload data to show updated user assignments
      loadData();
    } catch (error) {
      console.error("Error sharing credentials:", error);
      toast.error("Failed to share subscription with employees");
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  const handleCreateSubscription = async () => {
    if (!newSubscription.subscription_name.trim()) {
      toast.error("Please enter a subscription name");
      return;
    }

    if (!newSubscription.owner_id) {
      toast.error("Please select an owner");
      return;
    }

    try {
      // Create subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert([{
          subscription_name: newSubscription.subscription_name,
          vendor_id: newSubscription.vendor_id || null,
          plan_tier: newSubscription.plan_tier,
          cost_per_period: newSubscription.cost_per_period ? parseFloat(newSubscription.cost_per_period) : null,
          cost_per_user: newSubscription.cost_per_user ? parseFloat(newSubscription.cost_per_user) : null,
          billing_cycle: newSubscription.billing_cycle,
          auto_renewal_status: newSubscription.auto_renewal_status,
          owner_id: newSubscription.owner_id,
          start_date: newSubscription.start_date || null,
          expiry_date: newSubscription.expiry_date || null,
          status: newSubscription.status,
          notes: newSubscription.notes || null,
          portal_url: newSubscription.portal_url || null,
          category: newSubscription.category || null,
          number_of_users: newSubscription.number_of_users || 0
        }])
        .select()
        .single();

      if (subscriptionError) throw subscriptionError;

      // Create subscription users
      if (newSubscription.selected_users.length > 0) {
        const userInserts = newSubscription.selected_users.map(userId => ({
          subscription_id: subscriptionData.id,
          user_id: userId
        }));

        const { error: usersError } = await supabase
          .from("subscription_users")
          .insert(userInserts);

        if (usersError) throw usersError;
      }

      // Create credentials if provided
      if (newSubscription.credentials.email || newSubscription.credentials.password) {
        const { error: credentialsError } = await supabase
          .from("credentials")
          .insert([{
            subscription_id: subscriptionData.id,
            email: newSubscription.credentials.email || null,
            password: newSubscription.credentials.password || null
          }]);

        if (credentialsError) throw credentialsError;
      }

      toast.success("Subscription created successfully!");
      setIsCreateDialogOpen(false);
      setNewSubscription({
        subscription_name: "",
        vendor_id: "",
        plan_tier: "Team Plan",
        cost_per_period: "",
        cost_per_user: "",
        billing_cycle: "Monthly",
        auto_renewal_status: "Enabled",
        owner_id: "",
        start_date: "",
        expiry_date: "",
        status: "Active",
        notes: "",
        portal_url: "",
        category: "",
        number_of_users: 0,
        selected_users: [],
        credentials: {
          email: "",
          password: ""
        }
      });
      loadData();
    } catch (error: unknown) {
      console.error("Error creating subscription:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to create subscription: ${errorMessage}`);
    }
  };

  const filteredSubscriptions = subscriptions
    .filter(sub => {
      const name = sub.subscription_name || '';
      const vendorName = sub.vendor?.full_name || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           vendorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(sub.status || '');
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(sub.category || '');
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: unknown = a[sortField as keyof typeof a];
      let bValue: unknown = b[sortField as keyof typeof b];

      // Handle different data types
      if (sortField === "created_at" || sortField === "expiry_date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === "cost_per_user" || sortField === "cost_per_period") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Pagination logic
  const totalCount = filteredSubscriptions.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedSubscriptions = filteredSubscriptions.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // Reset to first page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, statusFilter, categoryFilter]);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'Active');
  const totalAnnualCost = activeSubscriptions.reduce((sum, sub) => sum + calculateTotalAnnualCost(sub), 0);
  const renewalsSoon = activeSubscriptions.filter(s => {
    const days = getDaysUntilExpiry(s.expiry_date);
    return days <= 30 && days >= 0;
  }).length;
  const autoRenewEnabled = activeSubscriptions.filter(s => s.auto_renewal_status === 'Enabled').length;

  const spendByCategory = activeSubscriptions.reduce((acc, sub) => {
    const category = sub.category || 'Other';
    acc[category] = (acc[category] || 0) + calculateTotalAnnualCost(sub);
    return acc;
  }, {} as { [key: string]: number });

  const upcomingRenewals = activeSubscriptions
    .filter(s => {
      const days = getDaysUntilExpiry(s.expiry_date);
      return days <= 30 && days >= 0;
    })
    .sort((a, b) => getDaysUntilExpiry(a.expiry_date) - getDaysUntilExpiry(b.expiry_date));

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Loading subscription data...</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col h-full overflow-hidden font-sans">
          <div className="flex-1 overflow-hidden p-1">

            {/* Dashboard Page */}
            {currentPage === 'dashboard' && (
              <div className="space-y-1 overflow-y-auto h-full">
                {/* Navigation */}
                <SubscriptionFilters
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  showKanban={showKanban}
                  setShowKanban={setShowKanban}
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  onAddSubscription={() => setIsCreateDialogOpen(true)}
                  allCategories={ALL_CATEGORIES}
                />

                {/* KPIs */}
                <SubscriptionKPICards
                  totalAnnualCost={totalAnnualCost}
                  activeSubscriptions={activeSubscriptions.length}
                  renewalsSoon={renewalsSoon}
                  autoRenewEnabled={autoRenewEnabled}
                  formatCurrency={formatCurrency}
                />

                {/* Charts and Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <SubscriptionSpendChart
                    spendByCategory={spendByCategory}
                    totalAnnualCost={totalAnnualCost}
                    formatCurrency={formatCurrency}
                    getCategoryColor={getCategoryColor}
                  />
                  <SubscriptionRenewalsList
                    upcomingRenewals={upcomingRenewals}
                    onSubscriptionClick={(sub) => {
                      setSelectedSubscription(sub);
                      setCurrentPage('details');
                    }}
                    getDaysUntilExpiry={getDaysUntilExpiry}
                    formatDate={formatDate}
                  />
                </div>
              </div>
            )}

            {/* Subscriptions List Page */}
            {currentPage === 'subscriptions' && (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Action Bar - Fixed */}
                <SubscriptionFilters
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  showKanban={showKanban}
                  setShowKanban={setShowKanban}
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  onAddSubscription={() => setIsCreateDialogOpen(true)}
                  allCategories={ALL_CATEGORIES}
                />

                {/* Table/Kanban Container - Scrollable */}
                {!showKanban ? (
                  <SubscriptionTableView
                    subscriptions={paginatedSubscriptions}
                    visibleColumns={visibleColumns}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onViewSubscription={(sub) => {
                      setSelectedSubscription(sub);
                      setCurrentPage('details');
                    }}
                    onEditSubscription={handleEditSubscription}
                    onShareCredentials={(sub) => {
                      setSelectedSubscriptionForShare(sub);
                      setShareCredentialsOpen(true);
                    }}
                    onDeleteSubscription={(sub) => {
                      // Delete functionality can be added here
                      console.log('Delete subscription:', sub);
                    }}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    calculateTotalAnnualCost={calculateTotalAnnualCost}
                    getStatusColor={getStatusColor}
                  />
                ) : (
                  <SubscriptionKanbanView
                    subscriptions={filteredSubscriptions}
                    onSubscriptionClick={(sub) => {
                      setSelectedSubscription(sub);
                      setCurrentPage('details');
                    }}
                    formatCurrency={formatCurrency}
                    calculateTotalAnnualCost={calculateTotalAnnualCost}
                    getStatusColor={getStatusColor}
                  />
                )}

                {/* Pagination - Fixed at Bottom */}
                {!showKanban && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-t border-border bg-muted/20 px-4 flex-shrink-0">
                    <div className="text-sm text-muted-foreground">
                      {totalCount > 0 ? (
                        <>
                          Showing <span className="font-medium text-foreground">{pageIndex * pageSize + 1}</span> to{" "}
                          <span className="font-medium text-foreground">{Math.min((pageIndex + 1) * pageSize, totalCount)}</span> of{" "}
                          <span className="font-medium text-foreground">{totalCount}</span> subscriptions
                        </>
                      ) : (
                        "No subscriptions found"
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                        <select
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                          }}
                          className="h-9 w-20 rounded-md border border-input bg-background text-sm font-medium px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {[10, 20, 50, 100].map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          Page <span className="font-medium text-foreground">{pageIndex + 1}</span> of <span className="font-medium text-foreground">{totalPages || 1}</span>
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={pageIndex === 0}
                            onClick={() => setPageIndex(0)}
                            className="hidden sm:inline-flex h-9"
                          >
                            First
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={pageIndex === 0}
                            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                            className="h-9"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={(pageIndex + 1) * pageSize >= totalCount}
                            onClick={() => setPageIndex((prev) => prev + 1)}
                            className="h-9"
                          >
                            Next
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={(pageIndex + 1) * pageSize >= totalCount}
                            onClick={() => setPageIndex(totalPages - 1)}
                            className="hidden sm:inline-flex h-9"
                          >
                            Last
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details Page */}
            {currentPage === 'details' && selectedSubscription && (
              <SubscriptionDetailsView
                subscription={selectedSubscription}
                onBack={() => setCurrentPage('subscriptions')}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                calculateTotalAnnualCost={calculateTotalAnnualCost}
                getStatusColor={getStatusColor}
              />
            )}
          </div>
        </div>

        {/* Create Subscription Dialog */}
        <CreateSubscriptionModal
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateSubscription}
          newSubscription={newSubscription}
          setNewSubscription={setNewSubscription}
          employees={employees}
          allCategories={ALL_CATEGORIES}
        />

        {/* Share Credentials Dialog */}
        <ShareCredentialsModal
          isOpen={shareCredentialsOpen}
          onClose={() => setShareCredentialsOpen(false)}
          onSubmit={handleShareCredentials}
          selectedSubscription={selectedSubscriptionForShare}
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          employees={employees}
        />

        {/* Edit Subscription Dialog */}
        <CreateSubscriptionModal
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingSubscription(null);
          }}
          onSubmit={() => {
            // For now, just close the modal
            // You can implement update functionality later
            setIsEditDialogOpen(false);
            setEditingSubscription(null);
            toast.success("Edit functionality will be implemented soon!");
          }}
          newSubscription={editingSubscription ? {
            subscription_name: editingSubscription.subscription_name,
            vendor_id: editingSubscription.vendor_id || "",
            plan_tier: editingSubscription.plan_tier || "Team Plan",
            cost_per_period: editingSubscription.cost_per_period?.toString() || "",
            cost_per_user: editingSubscription.cost_per_user?.toString() || "",
            billing_cycle: editingSubscription.billing_cycle || "Monthly",
            auto_renewal_status: editingSubscription.auto_renewal_status || "Enabled",
            owner_id: editingSubscription.owner_id || "",
            start_date: editingSubscription.start_date || "",
            expiry_date: editingSubscription.expiry_date || "",
            status: editingSubscription.status || "Active",
            notes: editingSubscription.notes || "",
            portal_url: editingSubscription.portal_url || "",
            category: editingSubscription.category || "",
            number_of_users: editingSubscription.number_of_users || 0,
            selected_users: editingSubscription.users?.map(u => u.full_name) || [],
            credentials: editingSubscription.credentials || { email: "", password: "" }
          } : newSubscription}
          setNewSubscription={setNewSubscription}
          employees={employees}
          allCategories={ALL_CATEGORIES}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function SubscriptionsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return <SubscriptionsPageContent />;
}