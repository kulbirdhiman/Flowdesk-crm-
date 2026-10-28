import { 
  Palette, 
  Building2, 
  Truck, 
  FileText, 
  Video,
  Settings
} from "lucide-react"

// Function to get service icon based on service name
export const getServiceIcon = (serviceName: string) => {
  const service = serviceName.toLowerCase()
  
  if (service.includes('brand') || service.includes('development')) {
    return <Palette className="w-5 h-5 text-purple-600" />
  } else if (service.includes('canton')) {
    return <Building2 className="w-5 h-5 text-blue-600" />
  } else if (service.includes('dropshipping')) {
    return <Truck className="w-5 h-5 text-green-600" />
  } else if (service.includes('llc') || service.includes('formation')) {
    return <FileText className="w-5 h-5 text-orange-600" />
  } else if (service.includes('video') || service.includes('call')) {
    return <Video className="w-5 h-5 text-red-600" />
  } else {
    return <Settings className="w-5 h-5 text-gray-600" />
  }
}

// Helper function to get total assigned employees
export const getTotalAssignedEmployees = (config: { [serviceName: string]: string[] }) => {
  return Object.values(config).reduce((total, employees) => total + employees.length, 0)
}

// Helper function to get service statistics
export const getServiceStats = (services: string[], config: { [serviceName: string]: string[] }) => {
  const totalServices = services.length
  const configuredServices = Object.keys(config).filter(service => 
    config[service] && config[service].length > 0
  ).length
  return { totalServices, configuredServices }
}
