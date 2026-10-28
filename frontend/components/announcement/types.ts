export interface AnnouncementData {
  type: 'announcement' | 'thought' | 'motivation' | 'note'
  title: string
  message: string
}

export interface AnnouncementType {
  value: 'announcement' | 'thought' | 'motivation' | 'note'
  label: string
  icon: any
  gradient: string
  textGradient: string
}

export const announcementTypes: AnnouncementType[] = [
  { 
    value: 'announcement', 
    label: 'Announcement', 
    icon: null, // Will be imported in components
    gradient: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
    textGradient: 'bg-gradient-to-r from-blue-100 to-blue-200'
  },
  { 
    value: 'thought', 
    label: 'Thought of the Day', 
    icon: null, // Will be imported in components
    gradient: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',
    textGradient: 'bg-gradient-to-r from-yellow-100 to-orange-100'
  },
  { 
    value: 'motivation', 
    label: 'Motivation', 
    icon: null, // Will be imported in components
    gradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-red-500',
    textGradient: 'bg-gradient-to-r from-pink-100 to-rose-100'
  },
  { 
    value: 'note', 
    label: 'Note', 
    icon: null, // Will be imported in components
    gradient: 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500',
    textGradient: 'bg-gradient-to-r from-purple-100 to-violet-100'
  },
]
