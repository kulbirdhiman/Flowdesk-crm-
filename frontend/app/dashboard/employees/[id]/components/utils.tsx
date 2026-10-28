import { EmployeeData, CallData, AttendanceData, DocumentData, BankDetails } from "./types"

export const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase() || ""
  if (s === "present") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
  if (s === "absent") return "destructive"
  if (s === "half day") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
  return "secondary"
}

export const getCallTypeBadge = (type: string) => {
  if (type === "Incoming") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
  if (type === "Outgoing") return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
  return "secondary"
}

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short", 
    year: "numeric"
  }
  return new Date(dateString).toLocaleDateString("en-GB", options || defaultOptions)
}

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const parseBankDetails = (bankDetails: string): BankDetails => {
  if (!bankDetails) return { bankName: "N/A", accountNumber: "N/A", ifscCode: "N/A" }
  
  const lines = bankDetails.split("\n")
  return {
    bankName: lines.find((l) => l.includes("Bank Name"))?.split("-")[1]?.trim() || "N/A",
    accountNumber: lines.find((l) => l.includes("Account No"))?.split("-")[1]?.trim() || "N/A",
    ifscCode: lines.find((l) => l.includes("IFSC Code"))?.split("-")[1]?.trim() || "N/A"
  }
}

export const formatCurrency = (amount: number): string => {
  return `$${Number(amount).toLocaleString()}`
}

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export const filterCalls = (calls: CallData[], dateFilter: string, searchFilter: string): CallData[] => {
  return calls.filter((call) => {
    let matches = true
    if (dateFilter) matches = matches && (call.call_date?.startsWith(dateFilter) || false)
    if (searchFilter) {
      const search = searchFilter.toLowerCase()
      matches = matches && (
        (call.client_name?.toLowerCase().includes(search) || false) ||
        (call.client_number?.includes(search) || false)
      )
    }
    return matches
  })
}

export const sortByDate = <T extends { date: string }>(items: T[], ascending = false): T[] => {
  return items.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return ascending ? dateA - dateB : dateB - dateA
  })
}

export const sortByCallDate = (calls: CallData[], ascending = false): CallData[] => {
  return calls.sort((a, b) => {
    const dateA = new Date(a.call_date).getTime()
    const dateB = new Date(b.call_date).getTime()
    return ascending ? dateA - dateB : dateB - dateA
  })
}

export const getCallStats = (calls: CallData[]) => {
  const totalCalls = calls.length
  const incomingCalls = calls.filter(c => c.call_type === "Incoming").length
  const outgoingCalls = calls.filter(c => c.call_type === "Outgoing").length
  
  return {
    total: totalCalls,
    incoming: incomingCalls,
    outgoing: outgoingCalls
  }
}

export const getDocumentStats = (documents: DocumentData[]) => {
  const submitted = documents.filter(d => d.collection_status === "Submitted").length
  const notSubmitted = documents.filter(d => d.collection_status !== "Submitted").length
  
  return {
    total: documents.length,
    submitted,
    notSubmitted
  }
}

export const getAttendanceStats = (attendance: AttendanceData[]) => {
  const present = attendance.filter(a => a.status.toLowerCase() === "present").length
  const absent = attendance.filter(a => a.status.toLowerCase() === "absent").length
  const halfDay = attendance.filter(a => a.status.toLowerCase().includes("half day")).length
  const late = attendance.filter(a => a.status.toLowerCase() === "late").length
  
  return {
    total: attendance.length,
    present,
    absent,
    halfDay,
    late
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}
