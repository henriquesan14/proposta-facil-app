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