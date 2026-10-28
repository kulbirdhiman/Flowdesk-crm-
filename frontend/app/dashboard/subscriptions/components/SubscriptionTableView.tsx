"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Share2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Subscription {
  id: string;
  subscription_name: string;
  vendor?: {
    full_name: string;
  };
  plan_tier?: string;
  cost_per_user?: number;
  number_of_users?: number;
  cost_per_period?: number;
  status?: string;
  expiry_date?: string;
  credentials?: {
    email?: string;
    password?: string;
  };
}

interface SubscriptionTableViewProps {
  subscriptions: Subscription[];
  visibleColumns: {
    subscription: boolean;
    plan: boolean;
    cost: boolean;
    users: boolean;
    annualCost: boolean;
    status: boolean;
    renewal: boolean;
    actions: boolean;
  };
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onViewSubscription: (subscription: Subscription) => void;
  onEditSubscription: (subscription: Subscription) => void;
  onShareCredentials: (subscription: Subscription) => void;
  onDeleteSubscription: (subscription: Subscription) => void;
  formatCurrency: (amount: number | undefined) => string;
  formatDate: (dateString: string | undefined) => string;
  calculateTotalAnnualCost: (sub: Subscription) => number;
  getStatusColor: (status: string | undefined) => string;
}

export default function SubscriptionTableView({
  subscriptions,
  visibleColumns,
  sortField,
  sortDirection,
  onSort,
  onViewSubscription,
  onEditSubscription,
  onShareCredentials,
  onDeleteSubscription,
  formatCurrency,
  formatDate,
  calculateTotalAnnualCost,
  getStatusColor
}: SubscriptionTableViewProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" /> : 
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 min-h-0">
      <div className="w-full rounded-md border">
        <Table className="w-full">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {visibleColumns.subscription && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("subscription_name")}
                    className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                  >
                    Subscription
                    {getSortIcon("subscription_name")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.plan && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("plan_tier")}
                    className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                  >
                    Plan/Tier
                    {getSortIcon("plan_tier")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.cost && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("cost_per_user")}
                    className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                  >
                    Cost per User
                    {getSortIcon("cost_per_user")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.users && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("number_of_users")}
                    className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                  >
                    No. of Users
                    {getSortIcon("number_of_users")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.annualCost && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("cost_per_period")}
                    className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                  >
                    Annual Cost
                    {getSortIcon("cost_per_period")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.status && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("status")}
                    className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                  >
                    Status
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.renewal && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">
                  <Button
                    variant="ghost"
                    onClick={() => onSort("expiry_date")}
                    className="h-7 px-2 hover:bg-transparent text-xs font-semibold"
                  >
                    Renewal Date
                    {getSortIcon("expiry_date")}
                  </Button>
                </TableHead>
              )}
              {visibleColumns.actions && (
                <TableHead className="text-xs font-semibold text-foreground px-3 py-3">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length > 0 ? (
              subscriptions.map(sub => (
                <TableRow 
                  key={sub.id} 
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  {visibleColumns.subscription && (
                    <TableCell className="py-3 px-3">
                      <div>
                        <div className="font-semibold text-sm">{sub.subscription_name}</div>
                        <div className="text-xs text-muted-foreground truncate" title={sub.vendor?.full_name || 'N/A'}>
                          {sub.vendor?.full_name || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.plan && (
                    <TableCell className="py-3 px-3">
                      <div className="text-sm">{sub.plan_tier || 'N/A'}</div>
                    </TableCell>
                  )}
                  {visibleColumns.cost && (
                    <TableCell className="py-3 px-3">
                      <div className="text-sm">{formatCurrency(sub.cost_per_user)}</div>
                    </TableCell>
                  )}
                  {visibleColumns.users && (
                    <TableCell className="py-3 px-3">
                      <div className="text-sm">{sub.number_of_users || 0}</div>
                    </TableCell>
                  )}
                  {visibleColumns.annualCost && (
                    <TableCell className="py-3 px-3">
                      <div className="text-sm font-semibold">{formatCurrency(calculateTotalAnnualCost(sub))}</div>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell className="py-3 px-3">
                      <Badge className={`${getStatusColor(sub.status)} text-white text-xs`}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.renewal && (
                    <TableCell className="py-3 px-3">
                      <div className="text-sm">{formatDate(sub.expiry_date)}</div>
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewSubscription(sub);
                                }}
                                className="h-8 px-2"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="bg-black text-white">
                              <p>View</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditSubscription(sub);
                                }}
                                className="h-8 px-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="bg-black text-white">
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShareCredentials(sub);
                                }}
                                className="h-8 px-2"
                                disabled={!sub.credentials?.email && !sub.credentials?.password}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="bg-black text-white">
                              <p>Share</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSubscription(sub);
                                }}
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="bg-black text-white">
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">No Subscriptions Found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your filters or resetting the view.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
