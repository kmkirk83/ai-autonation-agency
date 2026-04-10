import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: orders, isLoading } = trpc.payments.getOrders.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      toast.success("Payment successful! Your order has been confirmed.");
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view orders</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Order History</h1>

        {!orders || orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Button onClick={() => navigate("/pricing")}>Browse Products</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 border border-border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${(order.amount / 100).toFixed(2)}
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-2">
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-2">Items:</h4>
                  <ul className="space-y-1">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {item.productKey} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Payment ID: {order.stripePaymentIntentId.slice(0, 20)}...
                  </div>
                  <Button variant="outline" size="sm">
                    Download Invoice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
