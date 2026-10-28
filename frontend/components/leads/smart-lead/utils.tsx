import { Lead, DuplicateGroup, EnrichmentResult, LeadData } from "./types"

export const detectDuplicates = (leadsData: Lead[]): DuplicateGroup[] => {
  const duplicateGroups: DuplicateGroup[] = []
  const processed = new Set<string>()

  leadsData.forEach(lead => {
    if (processed.has(lead.id)) return

    const similarLeads = leadsData.filter(otherLead => {
      if (otherLead.id === lead.id || processed.has(otherLead.id)) return false
      
      // Check for duplicates based on multiple criteria
      const emailMatch = lead.email && otherLead.email && 
        lead.email.toLowerCase() === otherLead.email.toLowerCase()
      const phoneMatch = lead.phone && otherLead.phone && 
        lead.phone.replace(/\D/g, '') === otherLead.phone.replace(/\D/g, '')
      const nameMatch = lead.name && otherLead.name && 
        lead.name.toLowerCase().includes(otherLead.name.toLowerCase()) ||
        otherLead.name.toLowerCase().includes(lead.name.toLowerCase())

      return emailMatch || phoneMatch || nameMatch
    })

    if (similarLeads.length > 0) {
      const group: DuplicateGroup = {
        id: `group_${lead.id}`,
        confidence: Math.random() * 30 + 70, // 70-100% confidence
        reason: similarLeads.some(l => l.email === lead.email) ? 'Email match' :
                similarLeads.some(l => l.phone === lead.phone) ? 'Phone match' : 'Name match',
        leads: [lead, ...similarLeads],
        suggestedAction: similarLeads.length === 1 ? 'merge' : 'manual_review'
      }

      duplicateGroups.push(group)
      processed.add(lead.id)
      similarLeads.forEach(l => processed.add(l.id))
    }
  })

  return duplicateGroups
}

export const enrichLeads = async (leadIds: string[]): Promise<EnrichmentResult[]> => {
  const results: EnrichmentResult[] = []
  
  for (const leadId of leadIds) {
    // Simulate API call to enrichment service
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result: EnrichmentResult = {
      leadId,
      status: Math.random() > 0.2 ? 'success' : 'partial',
      newData: {
        companyName: `Company ${Math.floor(Math.random() * 1000)}`,
        jobTitle: ['CEO', 'CTO', 'Manager', 'Director'][Math.floor(Math.random() * 4)],
        industry: ['Technology', 'Finance', 'Healthcare', 'Retail'][Math.floor(Math.random() * 4)],
        companySize: ['1-10', '11-50', '51-200', '200+'][Math.floor(Math.random() * 4)],
        socialProfiles: ['LinkedIn', 'Twitter', 'Facebook'],
        additionalEmails: [`work${Math.random().toString(36).substr(2, 5)}@company.com`],
        additionalPhones: [`+91${Math.floor(Math.random() * 9000000000) + 1000000000}`]
      },
      confidence: Math.random() * 40 + 60,
      sources: ['LinkedIn', 'Company Database', 'Public Records']
    }
    
    results.push(result)
  }
  
  return results
}

export const mergeLeads = async (duplicateGroup: DuplicateGroup): Promise<Lead> => {
  // Keep the lead with the most recent date and highest deal amount
  const primaryLead = duplicateGroup.leads.reduce((prev, current) => 
    new Date(current.dateCreated) > new Date(prev.dateCreated) ? current : prev
  )
  
  const leadsToDelete = duplicateGroup.leads.filter(lead => lead.id !== primaryLead.id)
  
  // Update primary lead with combined data
  const updatedLead = {
    ...primaryLead,
    dealAmount: Math.max(...duplicateGroup.leads.map(l => l.dealAmount)),
    // Combine other fields as needed
  }
  
  // In a real implementation, you would:
  // 1. Update the primary lead in the database
  // 2. Delete the duplicate leads
  // 3. Update any related records
  
  console.log('Merging leads:', { primaryLead, leadsToDelete, updatedLead })
  
  return updatedLead
}

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-600 bg-green-100'
  if (confidence >= 70) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-500'
    case 'partial': return 'text-yellow-500'
    case 'failed': return 'text-red-500'
    default: return 'text-blue-500'
  }
}

export const formatLeadData = (leadsData: LeadData[]): Lead[] => {
  return leadsData.map(lead => ({
    id: lead.whalesync_postgres_id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    city: lead.city,
    source: lead.source,
    stage: lead.stage,
    services: lead.services,
    dealAmount: parseFloat(lead.deal_amount) || 0,
    dateCreated: lead.date_and_time,
    assignedTo: lead.assigned_to
  }))
}
