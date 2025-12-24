import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getOrderById } from '@/api/orders';
import { formatPrice, formatDateTime } from '@/lib/format';

function AccountOrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">ไม่พบคำสั่งซื้อ</h1>
        <Button asChild variant="outline" className="border-2 border-primary">
          <Link to="/account/orders">กลับไปหน้าคำสั่งซื้อ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        asChild
        variant="outline"
        className="mb-6 border-2 border-primary"
      >
        <Link to="/account/orders">
          <ChevronLeft className="mr-2 h-4 w-4" />
          กลับ
        </Link>
      </Button>

      <Card className="border-2 border-primary max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>คำสั่งซื้อ {order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                สั่งซื้อเมื่อ {formatDateTime(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timeline */}
          <OrderTimeline currentStatus={order.status} />

          <Separator className="h-0.5 bg-primary" />

          {/* Items */}
          <div>
            <h3 className="font-bold mb-3">รายการสินค้า</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-3 p-3 border-2 border-primary">
                  <Link to={`/products/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover border-2 border-primary hover:opacity-80"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.slug}`}>
                      <p className="font-medium hover:underline">{item.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      จำนวน: {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="h-0.5 bg-primary" />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ราคาสินค้า</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>ค่าจัดส่ง</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <Separator className="h-0.5 bg-primary" />
            <div className="flex justify-between text-lg font-bold">
              <span>ยอดรวม</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <Separator className="h-0.5 bg-primary" />

          {/* Shipping Address */}
          <div>
            <h3 className="font-bold mb-2">ที่อยู่จัดส่ง</h3>
            <p className="text-sm">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.phone}<br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />
              {order.shippingAddress.district}, {order.shippingAddress.province}{' '}
              {order.shippingAddress.postalCode}
            </p>
          </div>

          <Separator className="h-0.5 bg-primary" />

          {/* Payment Method */}
          <div>
            <h3 className="font-bold mb-2">วิธีการชำระเงิน</h3>
            <p className="text-sm">{order.paymentMethod}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AccountOrderDetail() {
  return (
    <ProtectedRoute>
      <AccountOrderDetailPage />
    </ProtectedRoute>
  );
}
