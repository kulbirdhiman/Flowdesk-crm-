"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  AlertCircle, 
  Trash2, 
  Save, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Users
} from "lucide-react"
import ServiceEmployeeSelector from "./ServiceEmployeeSelector"

interface EmployeeFields {
  whalesync_postgres_id: string
  full_name: string
  job_title?: string
  profile_photo?: string
}

interface ServiceConfigurationCardProps {
  services: string[]
  employees: EmployeeFields[]
  config: { [serviceName: string]: string[] }
  expandedServices: Set<string>
  isSaving: boolean
  saveMessage: string
  onToggleServiceExpansion: (serviceName: string) => void
  onCheckboxChange: (serviceName: string, employeeId: string) => void
  onSaveConfig: () => void
  onClearConfig: () => void
  getServiceIcon: (serviceName: string) => React.ReactNode
}

export default function ServiceConfigurationCard({
  services,
  employees,
  config,
  expandedServices,
  isSaving,
  saveMessage,
  onToggleServiceExpansion,
  onCheckboxChange,
  onSaveConfig,
  onClearConfig,
  getServiceIcon
}: ServiceConfigurationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Service Configuration
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={onClearConfig}
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
            <Button
              onClick={onSaveConfig}
              disabled={isSaving}
              size="sm"
              className="gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              {saveMessage}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Services Found</h3>
            <p className="text-muted-foreground">No services are available in the database.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {services.map((serviceName, index) => {
              const isExpanded = expandedServices.has(serviceName)
              const assignedCount = config[serviceName]?.length || 0
              
              return (
                <Card key={serviceName} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div 
                      className="py-0.5 px-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => onToggleServiceExpansion(serviceName)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {getServiceIcon(serviceName)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{serviceName}</h3>
                            <p className="text-sm text-muted-foreground">Service #{index + 1}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs">
                            <Users className="h-3 w-3" />
                            {assignedCount} assigned
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <ServiceEmployeeSelector
                        serviceName={serviceName}
                        employees={employees}
                        config={config}
                        onCheckboxChange={onCheckboxChange}
                      />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
