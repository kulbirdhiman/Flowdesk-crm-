"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Eye, EyeOff } from "lucide-react";
import SubscriptionCredentialsSection from "./SubscriptionCredentialsSection";

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

interface SubscriptionDetailsModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  showCredentials: { [key: string]: boolean };
  onTogglePasswordVisibility: (subscriptionId: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
  formatCurrency: (amount: number | undefined) => string;
  formatDate: (dateString: string | undefined) => string;
  getStatusColor: (status: string | undefined) => string;
  getStatusIcon: (status: string | undefined) => React.ReactNode;
}

export default function SubscriptionDetailsModal({
  subscription,
  isOpen,
  onClose,
  showCredentials,
  onTogglePasswordVisibility,
  onCopyToClipboard,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusIcon
}: SubscriptionDetailsModalProps) {
  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{subscription.subscription_name}</DialogTitle>
          <DialogDescription>
            Detailed information about this subscription
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(subscription.status)}
                <Badge className={`${getStatusColor(subscription.status)} text-white`}>
                  {subscription.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Category</label>
              <div className="mt-1">{subscription.category || 'N/A'}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Plan/Tier</label>
              <div className="mt-1">{subscription.plan_tier || 'N/A'}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Billing Cycle</label>
              <div className="mt-1">{subscription.billing_cycle || 'N/A'}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Cost per Period</label>
              <div className="mt-1">{formatCurrency(subscription.cost_per_period)}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Auto Renewal</label>
              <div className="mt-1">{subscription.auto_renewal_status || 'N/A'}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Start Date</label>
              <div className="mt-1">{formatDate(subscription.start_date)}</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Expiry Date</label>
              <div className="mt-1">{formatDate(subscription.expiry_date)}</div>
            </div>
          </div>

          {/* Owner Info */}
          <div>
            <label className="text-sm text-muted-foreground">Owner/Responsible Person</label>
            <div className="mt-1">
              {subscription.owner?.full_name || 'N/A'}
              {subscription.owner?.official_email && (
                <div className="text-sm text-muted-foreground">
                  {subscription.owner.official_email}
                </div>
              )}
            </div>
          </div>

          {/* Credentials */}
          <SubscriptionCredentialsSection
            credentials={subscription.credentials}
            subscriptionId={subscription.id}
            showCredentials={showCredentials}
            onTogglePasswordVisibility={onTogglePasswordVisibility}
            onCopyToClipboard={onCopyToClipboard}
            isCompact={false}
          />

          {/* Notes */}
          {subscription.notes && (
            <div>
              <label className="text-sm text-muted-foreground">Notes</label>
              <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                {subscription.notes}
              </div>
            </div>
          )}

          {/* Portal Link */}
          {subscription.portal_url && (
            <div>
              <Button
                onClick={() => window.open(subscription.portal_url, '_blank')}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Portal
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
