export interface Subscription {
  id: string;
  tenantId: string;
  subscriptionPlanId: string;
  subscriptionPlan: {
    id: string;
    name: string;
    maxProposalsPerMonth: number;
    price: number;
    description: string;
  };
  startDate: string;
  status: string;
  proposalsUsed: number;
  subscriptionAsaasId: string;
  paymentLink: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  billingType: string;
  paidDate: string;
  paymentAsaasId: string;
  paymentLink: string;
}
