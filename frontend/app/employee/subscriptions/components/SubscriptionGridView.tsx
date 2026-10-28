"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
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

interface SubscriptionGridViewProps {
  subscriptions: Subscription[];
  onViewSubscription: (subscription: Subscription) => void;
  showCredentials: { [key: string]: boolean };
  onTogglePasswordVisibility: (subscriptionId: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
  formatCurrency: (amount: number | undefined) => string;
  formatDate: (dateString: string | undefined) => string;
  getDaysUntilExpiry: (dateString: string | undefined) => number;
  getStatusColor: (status: string | undefined) => string;
  getStatusIcon: (status: string | undefined) => React.ReactNode;
}

export default function SubscriptionGridView({
  subscriptions,
  onViewSubscription,
  showCredentials,
  onTogglePasswordVisibility,
  onCopyToClipboard,
  formatCurrency,
  formatDate,
  getDaysUntilExpiry,
  getStatusColor,
  getStatusIcon
}: SubscriptionGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((subscription) => (
        <Card key={subscription.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold">{subscription.subscription_name}</CardTitle>
                <CardDescription className="text-sm">
                  {subscription.vendor?.full_name || 'N/A'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(subscription.status)}
                <Badge className={`${getStatusColor(subscription.status)} text-white text-xs`}>
                  {subscription.status}
                </Badge>
              </div>
            </div>
            {subscription.category && (
              <Badge variant="outline" className="w-fit text-xs">
                {subscription.category}
              </Badge>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Subscription Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{subscription.plan_tier || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing:</span>
                <span className="font-medium">
                  {formatCurrency(subscription.cost_per_period)} / {subscription.billing_cycle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">{formatDate(subscription.expiry_date)}</span>
              </div>
              {getDaysUntilExpiry(subscription.expiry_date) <= 30 && getDaysUntilExpiry(subscription.expiry_date) >= 0 && (
                <div className="flex justify-between text-orange-600">
                  <span className="text-muted-foreground">Days Left:</span>
                  <span className="font-medium">{getDaysUntilExpiry(subscription.expiry_date)} days</span>
                </div>
              )}
            </div>

            {/* Credentials Section */}
            <SubscriptionCredentialsSection
              credentials={subscription.credentials}
              subscriptionId={subscription.id}
              showCredentials={showCredentials}
              onTogglePasswordVisibility={onTogglePasswordVisibility}
              onCopyToClipboard={onCopyToClipboard}
              isCompact={true}
            />

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewSubscription(subscription)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
