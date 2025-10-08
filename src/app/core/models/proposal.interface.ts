import { Client } from "./client.interface"
import { ProposalItem } from "./proposal-item.interface"

export interface Proposal {
  id: string
  tenantId: string
  client: Client
  number: string
  title: string
  proposalStatus: string
  currency: string
  totalAmount: number
  validUntil: string
  items: ProposalItem[]
  isActive: boolean
  createdAt: string
}