import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getOrders } from '@/api/orders';
import { formatPrice, formatDateTime } from '@/lib/format';

function AccountOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getOrders,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">คำสั่งซื้อของฉัน</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-4 max-w-4xl">
          {orders.map((order) => (
            <Link key={order.id} to={`/account/orders/${order.id}`}>
              <Card className="border-2 border-primary hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <OrderStatusBadge status={order.status} />
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {order.items.length} รายการ
                    </span>
                    <span className="font-bold text-lg">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-primary max-w-md mx-auto">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">คุณยังไม่มีคำสั่งซื้อ</p>
            <Link
              to="/products"
              className="text-primary font-medium hover:underline"
            >
              เลือกซื้อสินค้า
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AccountOrders() {
  return (
    <ProtectedRoute>
      <AccountOrdersPage />
    </ProtectedRoute>
  );
}
