export interface SubscriptionPlan {
    id: string;
    name: string;
    maxProposalsPerMonth: number;
    price: number;
    description: string;
    isActive: boolean;
    createdAt: string;
    createdByName: string;
}