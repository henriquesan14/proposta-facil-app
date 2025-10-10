import { PaginatedResult } from "./paginated-result.interface";
import { Payment } from "./payment.interface";
import { Subscription } from "./subscription.interface";

export interface SubscriptionAccountResponse {
    activeSubscription?: Subscription;
    payments: PaginatedResult<Payment>;
}