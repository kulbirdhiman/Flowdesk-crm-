"use client";

import { Button } from "@/components/ui/button";
import { Key, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";

interface Credentials {
  email?: string;
  password?: string;
}

interface SubscriptionCredentialsSectionProps {
  credentials: Credentials | null;
  subscriptionId: string;
  showCredentials: { [key: string]: boolean };
  onTogglePasswordVisibility: (subscriptionId: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
  isCompact?: boolean;
}

export default function SubscriptionCredentialsSection({
  credentials,
  subscriptionId,
  showCredentials,
  onTogglePasswordVisibility,
  onCopyToClipboard,
  isCompact = false
}: SubscriptionCredentialsSectionProps) {
  if (!credentials) return null;

  const containerClass = isCompact ? "border-t pt-2" : "border-t pt-4";
  const iconClass = isCompact ? "h-3 w-3" : "h-4 w-4";
  const textClass = isCompact ? "text-xs" : "text-sm";
  const buttonClass = isCompact ? "h-6 w-6 p-0" : "h-8 w-8 p-0";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2 mb-3">
        <Key className={`${iconClass} text-primary`} />
        <span className={`${textClass} font-medium`}>Credentials</span>
      </div>
      
      <div className="space-y-2">
        {credentials.email && (
          <div className="flex items-center gap-2">
            <span className={`${textClass} text-muted-foreground ${isCompact ? 'w-12' : 'w-16'}`}>Email:</span>
            <span className={`${textClass} font-mono flex-1 truncate`}>{credentials.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyToClipboard(credentials.email, "Email")}
              className={buttonClass}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {credentials.password && (
          <div className="flex items-center gap-2">
            <span className={`${textClass} text-muted-foreground ${isCompact ? 'w-12' : 'w-16'}`}>Password:</span>
            <span className={`${textClass} font-mono flex-1 truncate`}>
              {showCredentials[subscriptionId] ? credentials.password : '••••••••'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePasswordVisibility(subscriptionId)}
              className={buttonClass}
            >
              {showCredentials[subscriptionId] ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyToClipboard(credentials.password, "Password")}
              className={buttonClass}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
