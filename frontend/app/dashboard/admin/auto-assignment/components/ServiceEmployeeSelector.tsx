"use client"

import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle } from "lucide-react"

interface EmployeeFields {
  whalesync_postgres_id: string
  full_name: string
  job_title?: string
  profile_photo?: string
}

interface ServiceEmployeeSelectorProps {
  serviceName: string
  employees: EmployeeFields[]
  config: { [serviceName: string]: string[] }
  onCheckboxChange: (serviceName: string, employeeId: string) => void
}

export default function ServiceEmployeeSelector({
  serviceName,
  employees,
  config,
  onCheckboxChange
}: ServiceEmployeeSelectorProps) {
  return (
    <>
      <Separator />
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employees.map(emp => {
            const isSelected = config[serviceName]?.includes(emp.whalesync_postgres_id) ?? false
            
            return (
              <label
                key={emp.whalesync_postgres_id}
                className={`group relative flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-1"
                  checked={isSelected}
                  onChange={() => onCheckboxChange(serviceName, emp.whalesync_postgres_id)}
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={emp.profile_photo || ""} alt={emp.full_name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {emp.full_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {emp.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {emp.job_title || 'Sales Representative'}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </label>
            )
          })}
        </div>
      </div>
    </>
  )
}
