export interface CheckoutSessionOptions {
  companyId: string;
  planId: string;
  planName: string;
  price: number;
  email: string;
}

export interface PaymentProvider {
  createCheckout(options: CheckoutSessionOptions): Promise<{ sessionId: string; checkoutUrl: string }>;
  confirmPayment(companyId: string, planId: string, externalSubscriptionId: string, externalCustomerId?: string): Promise<any>;
  cancelSubscription(externalSubscriptionId: string): Promise<any>;
  updatePlan(externalSubscriptionId: string, newPlanName: string): Promise<any>;
}
