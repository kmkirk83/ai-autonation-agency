import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const { data: products, isLoading } = trpc.payments.getProducts.useQuery(
    void 0,
    { enabled: isAuthenticated }
  );
  const createCheckout = trpc.payments.createCheckout.useMutation();

  const handlePurchase = async (productKey: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl("/pricing");
      return;
    }

    try {
      const origin = window.location.origin;
      const result = await createCheckout.mutateAsync({
        productKey,
        successUrl: `${origin}/orders?success=true`,
        cancelUrl: `${origin}/pricing`,
      });

      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Redirecting to checkout...");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading pricing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your business
          </p>
        </div>

        {/* One-time Products */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            One-Time Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products?.oneTime.map((product) => (
              <Card
                key={product.key}
                className="p-6 border border-border hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary">
                    ${(product.priceInCents / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">One-time payment</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-foreground flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase(product.key)}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? "Processing..." : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Monthly Subscriptions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products?.subscriptions.map((plan) => (
              <Card
                key={plan.key}
                className="p-6 border border-border hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary">
                    ${(plan.priceInCents / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">/month</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-foreground flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handlePurchase(plan.key)}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? "Processing..." : "Subscribe"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
