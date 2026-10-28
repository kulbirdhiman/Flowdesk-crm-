"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  subscription_name: string;
  vendor?: {
    full_name: string;
    profile_photo?: string;
  };
  plan_tier?: string;
  category?: string;
  cost_per_period?: number;
  billing_cycle?: string;
  auto_renewal_status?: string;
  owner?: {
    full_name: string;
    official_email?: string;
  };
  start_date?: string;
  expiry_date?: string;
  status?: string;
  notes?: string;
  portal_url?: string;
  users?: Array<{
    full_name: string;
  }>;
  credentials?: {
    email?: string;
    password?: string;
  };
}

interface SubscriptionDetailsViewProps {
  subscription: Subscription;
  onBack: () => void;
  formatCurrency: (amount: number | undefined) => string;
  formatDate: (dateString: string | undefined) => string;
  calculateTotalAnnualCost: (sub: Subscription) => number;
  getStatusColor: (status: string | undefined) => string;
}

export default function SubscriptionDetailsView({
  subscription,
  onBack,
  formatCurrency,
  formatDate,
  calculateTotalAnnualCost,
  getStatusColor
}: SubscriptionDetailsViewProps) {
  const handleShareCredentials = () => {
    if (subscription.credentials) {
      const message = `Here are the credentials for ${subscription.subscription_name}:\n\nEmail: ${subscription.credentials.email}\nPassword: ${subscription.credentials.password}\n\nPlease keep these secure.`;
      navigator.clipboard.writeText(message);
      toast.success("Credentials copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto h-full">
      <Card>
        <CardContent className="px-8 pt-0 pb-8">
          <div className="mb-0">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center md:items-start">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={subscription.vendor?.profile_photo} />
                <AvatarFallback className="text-2xl">
                  {subscription.vendor?.full_name?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-3xl font-bold text-center md:text-left">{subscription.subscription_name}</h2>
              <p className="text-xl text-muted-foreground mb-6 text-center md:text-left">
                {subscription.vendor?.full_name || 'N/A'}
              </p>
              {subscription.portal_url && (
                <Button asChild className="w-full">
                  <a href={subscription.portal_url} target="_blank" rel="noopener noreferrer">
                    Go to Portal
                  </a>
                </Button>
              )}
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge className={`${getStatusColor(subscription.status)} text-white`}>
                  {subscription.status}
                </Badge>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Plan / Tier</p>
                <div className="text-lg font-semibold">{subscription.plan_tier || 'N/A'}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <div className="text-lg font-semibold">{subscription.category || 'N/A'}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Annual Cost</p>
                <div className="text-lg font-semibold">{formatCurrency(calculateTotalAnnualCost(subscription))}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Billing</p>
                <div className="text-lg font-semibold">
                  {formatCurrency(subscription.cost_per_period)} / {subscription.billing_cycle}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Auto Renewal</p>
                <div className="text-lg font-semibold">{subscription.auto_renewal_status}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Owner</p>
                <div className="text-lg font-semibold">
                  {subscription.owner?.full_name || 'N/A'}
                  {subscription.owner?.official_email && (
                    <>
                      <br />
                      <span className="text-sm text-muted-foreground font-normal">
                        {subscription.owner.official_email}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <div className="text-lg font-semibold">{formatDate(subscription.start_date)}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Expiry Date</p>
                <div className="text-lg font-semibold">{formatDate(subscription.expiry_date)}</div>
              </div>
            </div>
            
            {subscription.credentials && (
              <div className="md:col-span-3 pt-6 border-t">
                <h4 className="text-lg font-semibold mb-2">Credentials</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <div className="text-lg font-semibold">{subscription.credentials.email || 'Not set'}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Password</p>
                    <div className="text-lg font-semibold">{subscription.credentials.password || 'Not set'}</div>
                  </div>
                  <div>
                    <Button
                      onClick={handleShareCredentials}
                      className="w-full"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Credentials
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-3 pt-6 border-t">
              <h4 className="text-lg font-semibold mb-2">
                Assigned Users ({subscription.users?.length || 0})
              </h4>
              {subscription.users && subscription.users.length > 0 ? (
                <p className="text-muted-foreground">
                  {subscription.users.map(user => user.full_name).join(', ')}
                </p>
              ) : (
                <p className="text-muted-foreground">No users are assigned to this subscription.</p>
              )}
            </div>

            <div className="md:col-span-3 pt-6 border-t">
              <h4 className="text-lg font-semibold mb-2">Notes</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {subscription.notes || 'No notes available.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
