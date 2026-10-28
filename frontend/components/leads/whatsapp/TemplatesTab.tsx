"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WhatsAppTemplate } from "./types"

interface TemplatesTabProps {
  templates: WhatsAppTemplate[]
  onApplyTemplate: (template: WhatsAppTemplate) => void
}

export default function TemplatesTab({
  templates,
  onApplyTemplate
}: TemplatesTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApplyTemplate(template)}
                >
                  Use
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {template.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Used {template.usage} times</span>
                <span>Last used: {template.lastUsed}</span>
              </div>
              
              {template.variables.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium mb-1">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
