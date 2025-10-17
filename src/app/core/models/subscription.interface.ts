import { Payment } from "./payment.interface";
import { SubscriptionPlan } from "./subscription-plan.interface";
import { Tenant } from "./tenant.interface";

export interface Subscription {
  id: string;
  tenantId: string;
  subscriptionPlanId: string;
  subscriptionPlan: SubscriptionPlan;
  pendingUpgradePlan: SubscriptionPlan;
  startDate: string;
  status: string;
  proposalsUsed: number;
  subscriptionAsaasId: string;
  paymentLink: string;
  payments: Payment[];
  tenant: Tenant;
  isActive: boolean;
  createdAt: string
  createdByName: string;
}
