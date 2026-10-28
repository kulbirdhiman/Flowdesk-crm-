"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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

interface SubscriptionTableViewProps {
  subscriptions: Subscription[];
  visibleColumns: {
    subscription: boolean;
    vendor: boolean;
    status: boolean;
    category: boolean;
    plan: boolean;
    billing: boolean;
    expires: boolean;
    actions: boolean;
  };
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  onSort: (column: string) => void;
  onViewSubscription: (subscription: Subscription) => void;
  formatCurrency: (amount: number | undefined) => string;
  formatDate: (dateString: string | undefined) => string;
  getStatusColor: (status: string | undefined) => string;
  getStatusIcon: (status: string | undefined) => React.ReactNode;
}

export default function SubscriptionTableView({
  subscriptions,
  visibleColumns,
  sortColumn,
  sortDirection,
  onSort,
  onViewSubscription,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusIcon
}: SubscriptionTableViewProps) {
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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.subscription && (
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort("subscription")}
              >
                <div className="flex items-center gap-2">
                  Subscription
                  {getSortIcon("subscription")}
                </div>
              </TableHead>
            )}
            {visibleColumns.vendor && (
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort("vendor")}
              >
                <div className="flex items-center gap-2">
                  Vendor
                  {getSortIcon("vendor")}
                </div>
              </TableHead>
            )}
            {visibleColumns.status && (
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon("status")}
                </div>
              </TableHead>
            )}
            {visibleColumns.category && (
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort("category")}
              >
                <div className="flex items-center gap-2">
                  Category
                  {getSortIcon("category")}
                </div>
              </TableHead>
            )}
            {visibleColumns.plan && (
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort("plan")}
              >
                <div className="flex items-center gap-2">
                  Plan
                  {getSortIcon("plan")}
                </div>
              </TableHead>
            )}
            {visibleColumns.billing && (
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort("billing")}
              >
                <div className="flex items-center gap-2">
                  Billing
                  {getSortIcon("billing")}
                </div>
              </TableHead>
            )}
            {visibleColumns.expires && (
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSort("expires")}
              >
                <div className="flex items-center gap-2">
                  Expires
                  {getSortIcon("expires")}
                </div>
              </TableHead>
            )}
            {visibleColumns.actions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              {visibleColumns.subscription && (
                <TableCell className="font-medium">{subscription.subscription_name}</TableCell>
              )}
              {visibleColumns.vendor && (
                <TableCell>{subscription.vendor?.full_name || 'N/A'}</TableCell>
              )}
              {visibleColumns.status && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(subscription.status)}
                    <Badge className={`${getStatusColor(subscription.status)} text-white text-xs`}>
                      {subscription.status}
                    </Badge>
                  </div>
                </TableCell>
              )}
              {visibleColumns.category && (
                <TableCell>
                  {subscription.category && (
                    <Badge variant="outline" className="text-xs">
                      {subscription.category}
                    </Badge>
                  )}
                </TableCell>
              )}
              {visibleColumns.plan && (
                <TableCell>{subscription.plan_tier || 'N/A'}</TableCell>
              )}
              {visibleColumns.billing && (
                <TableCell>
                  {formatCurrency(subscription.cost_per_period)} / {subscription.billing_cycle}
                </TableCell>
              )}
              {visibleColumns.expires && (
                <TableCell>{formatDate(subscription.expiry_date)}</TableCell>
              )}
              {visibleColumns.actions && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewSubscription(subscription)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {subscription.portal_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(subscription.portal_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
