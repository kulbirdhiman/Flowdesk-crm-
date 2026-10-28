"use client"

import { Megaphone, Lightbulb, Heart, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AnnouncementTypeSelectorProps {
  value: string
  onChange: (value: string) => void
}

const announcementTypes = [
  { 
    value: 'announcement', 
    label: 'Announcement', 
    icon: Megaphone, 
    gradient: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
    textGradient: 'bg-gradient-to-r from-blue-100 to-blue-200'
  },
  { 
    value: 'thought', 
    label: 'Thought of the Day', 
    icon: Lightbulb, 
    gradient: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',
    textGradient: 'bg-gradient-to-r from-yellow-100 to-orange-100'
  },
  { 
    value: 'motivation', 
    label: 'Motivation', 
    icon: Heart, 
    gradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-red-500',
    textGradient: 'bg-gradient-to-r from-pink-100 to-rose-100'
  },
  { 
    value: 'note', 
    label: 'Note', 
    icon: Sparkles, 
    gradient: 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500',
    textGradient: 'bg-gradient-to-r from-purple-100 to-violet-100'
  },
]

export default function AnnouncementTypeSelector({
  value,
  onChange
}: AnnouncementTypeSelectorProps) {
  const selectedType = announcementTypes.find(t => t.value === value)
  const IconComp = selectedType?.icon || Megaphone

  return (
    <div className="space-y-2">
      <Label htmlFor="type">Announcement Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="type" className="h-12">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-md ${selectedType?.gradient || 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700'}`}>
              <IconComp className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">{selectedType?.label || 'Select announcement type'}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {announcementTypes.map((type) => {
            const IconComp = type.icon;
            return (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${type.gradient}`}>
                    <IconComp className="h-4 w-4 text-white" />
                  </div>
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
