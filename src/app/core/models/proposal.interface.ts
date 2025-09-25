import { Client } from "./client.interface"
import { ProposalItem } from "./proposal-item.interface"

export interface Proposal {
  id: string
  tenantId: string
  client: Client
  number: string
  title: string
  proposalStatus: string
  totalAmount: string
  validUntil: string
  items: ProposalItem[]
}