export interface CreateProposal {
  id?: string;
  clientId: string
  title: string
  currency: string
  validUntil: string
  items: Item[]
}

export interface Item {
  name: string
  description: string
  quantity: number
  unitPrice: number
}
