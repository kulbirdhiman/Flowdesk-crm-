"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Linkedin, Edit2 } from "lucide-react"

interface EmployeeData {
  official_contact_number?: string
  linkedin_profile?: string
}

interface ContactDetailsSectionProps {
  employeeData: EmployeeData
}

export default function ContactDetailsSection({ employeeData }: ContactDetailsSectionProps) {
  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-md font-semibold">Contact Details</h4>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        <Card className="bg-muted/30">
          <CardContent className="p-3 flex items-center">
            <Phone className="h-4 w-4 text-muted-foreground mr-3" />
            <span className="text-sm">{employeeData.official_contact_number || "N/A"}</span>
          </CardContent>
        </Card>
        {employeeData.linkedin_profile && (
          <Card className="bg-muted/30">
            <CardContent className="p-3 flex items-center">
              <Linkedin className="h-4 w-4 text-muted-foreground mr-3" />
              <a
                href={employeeData.linkedin_profile.startsWith("http") ? employeeData.linkedin_profile : `https://${employeeData.linkedin_profile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View LinkedIn Profile
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
