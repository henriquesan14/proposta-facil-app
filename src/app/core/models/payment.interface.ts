export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  billingType: string;
  paymentDate: string;
  dueDate: string;
  paymentAsaasId: string;
  paymentLink: string;
  status: string;
  isActive: boolean;
}