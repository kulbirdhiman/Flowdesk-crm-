"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Employee {
  whalesync_postgres_id: string;
  full_name: string;
}

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newSubscription: {
    subscription_name: string;
    vendor_id: string;
    plan_tier: string;
    cost_per_period: string;
    cost_per_user: string;
    billing_cycle: string;
    auto_renewal_status: string;
    owner_id: string;
    start_date: string;
    expiry_date: string;
    status: string;
    notes: string;
    portal_url: string;
    category: string;
    number_of_users: number;
    selected_users: string[];
    credentials: {
      email: string;
      password: string;
    };
  };
  setNewSubscription: (subscription: any) => void;
  employees: Employee[];
  allCategories: string[];
}

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  onSubmit,
  newSubscription,
  setNewSubscription,
  employees,
  allCategories
}: CreateSubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Create a new subscription entry for your company.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subscriptionName" className="pt-1 block">Subscription Name *</Label>
              <Input
                id="subscriptionName"
                value={newSubscription.subscription_name}
                onChange={(e) => setNewSubscription({ ...newSubscription, subscription_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="vendor" className="pt-1 block">Vendor</Label>
              <Select
                value={newSubscription.vendor_id}
                onValueChange={(value) => setNewSubscription({ ...newSubscription, vendor_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vendor..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.whalesync_postgres_id} value={employee.whalesync_postgres_id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="planTier" className="pt-1 block">Plan/Tier</Label>
              <Select
                value={newSubscription.plan_tier}
                onValueChange={(value) => setNewSubscription({ ...newSubscription, plan_tier: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team Plan">Team Plan</SelectItem>
                  <SelectItem value="Business Plus">Business Plus</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category" className="pt-1 block">Category</Label>
              <Select
                value={newSubscription.category}
                onValueChange={(value) => setNewSubscription({ ...newSubscription, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPerPeriod" className="pt-1 block">Cost per Period (₹)</Label>
              <Input
                id="costPerPeriod"
                type="number"
                step="0.01"
                value={newSubscription.cost_per_period}
                onChange={(e) => setNewSubscription({ ...newSubscription, cost_per_period: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="billingCycle" className="pt-1 block">Billing Cycle</Label>
              <Select
                value={newSubscription.billing_cycle}
                onValueChange={(value) => setNewSubscription({ ...newSubscription, billing_cycle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                  <SelectItem value="Bi-Annual">Bi-Annual</SelectItem>
                  <SelectItem value="One-Time">One-Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPerUser" className="pt-1 block">Cost per User (₹)</Label>
              <Input
                id="costPerUser"
                type="number"
                step="0.01"
                value={newSubscription.cost_per_user}
                onChange={(e) => setNewSubscription({ ...newSubscription, cost_per_user: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="owner" className="pt-1 block">Owner/Responsible Person *</Label>
              <Select
                value={newSubscription.owner_id}
                onValueChange={(value) => setNewSubscription({ ...newSubscription, owner_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an owner..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.whalesync_postgres_id} value={employee.whalesync_postgres_id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="pt-1 block">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newSubscription.start_date}
                onChange={(e) => setNewSubscription({ ...newSubscription, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expiryDate" className="pt-1 block">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={newSubscription.expiry_date}
                onChange={(e) => setNewSubscription({ ...newSubscription, expiry_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="autoRenewalStatus" className="pt-1 block">Auto-Renewal Status</Label>
              <Select
                value={newSubscription.auto_renewal_status}
                onValueChange={(value) => setNewSubscription({ ...newSubscription, auto_renewal_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enabled">Enabled</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="pt-1 block">Status</Label>
              <Select
                value={newSubscription.status}
                onValueChange={(value) => setNewSubscription({ ...newSubscription, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="users" className="pt-1 block">Assign Users</Label>
            <Select
              value=""
              onValueChange={(value) => {
                const currentUsers = newSubscription.selected_users;
                if (!currentUsers.includes(value)) {
                  setNewSubscription({ ...newSubscription, selected_users: [...currentUsers, value] });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select users to add..." />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter(emp => !newSubscription.selected_users.includes(emp.whalesync_postgres_id))
                  .map(employee => (
                    <SelectItem key={employee.whalesync_postgres_id} value={employee.whalesync_postgres_id}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {newSubscription.selected_users.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newSubscription.selected_users.map(userId => {
                  const user = employees.find(emp => emp.whalesync_postgres_id === userId);
                  return (
                    <Badge key={userId} variant="secondary">
                      {user?.full_name}
                      <button
                        onClick={() => {
                          const updatedUsers = newSubscription.selected_users.filter(id => id !== userId);
                          setNewSubscription({ ...newSubscription, selected_users: updatedUsers });
                        }}
                        className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="portalUrl" className="pt-1 block">Portal URL</Label>
            <Input
              id="portalUrl"
              type="url"
              placeholder="https://example.com"
              value={newSubscription.portal_url}
              onChange={(e) => setNewSubscription({ ...newSubscription, portal_url: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes" className="pt-1 block">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={newSubscription.notes}
              onChange={(e) => setNewSubscription({ ...newSubscription, notes: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="credentialsEmail" className="pt-1 block">Credentials Email</Label>
              <Input
                id="credentialsEmail"
                type="email"
                value={newSubscription.credentials.email}
                onChange={(e) => setNewSubscription({ 
                  ...newSubscription, 
                  credentials: { ...newSubscription.credentials, email: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="credentialsPassword" className="pt-1 block">Credentials Password</Label>
              <Input
                id="credentialsPassword"
                type="password"
                value={newSubscription.credentials.password}
                onChange={(e) => setNewSubscription({ 
                  ...newSubscription, 
                  credentials: { ...newSubscription.credentials, password: e.target.value }
                })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Save Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
