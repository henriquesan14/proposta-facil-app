import { Subscription } from "./subscription.interface";

export interface SubscriptionAccountResponse {
    activeSubscription?: Subscription;
    previousSubscriptions: Subscription[];
}