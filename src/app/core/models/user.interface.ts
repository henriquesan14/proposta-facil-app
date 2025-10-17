import { Tenant } from "./tenant.interface"

export interface User {
    id: string
    name: string
    email: string
    phoneNumber: string
    role: string
    disabled: boolean
    isActive: boolean
    createdAt: string
    createdByName: string
    tenantImpersonate?: Tenant
}