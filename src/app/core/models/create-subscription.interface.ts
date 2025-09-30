export interface CreateSubscription{
    id?: string;
    tenantId: string;
    subscriptionPlanId: string;
    startDate: string;
    endDate: string;
    billingType: string;
}