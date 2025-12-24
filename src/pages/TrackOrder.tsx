import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { trackOrder } from '@/api/orders';
import { formatPrice, formatDateTime } from '@/lib/format';
import { Order } from '@/types';
import { toast } from 'sonner';

const schema = z.object({
  orderNumber: z.string().min(1, 'กรุณากรอกหมายเลขคำสั่งซื้อ'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
});

type FormData = z.infer<typeof schema>;

export default function TrackOrder() {
  const [order, setOrder] = useState<Order | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderNumber: '',
      email: '',
    },
  });

  const trackMutation = useMutation({
    mutationFn: trackOrder,
    onSuccess: (data) => {
      setOrder(data);
    },
    onError: () => {
      toast.error('ไม่พบคำสั่งซื้อ กรุณาตรวจสอบข้อมูลอีกครั้ง');
      setOrder(null);
    },
  });

  const onSubmit = (data: FormData) => {
    trackMutation.mutate({
      orderNumber: data.orderNumber,
      email: data.email,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">ตรวจสอบสถานะคำสั่งซื้อ</h1>

        {/* Search Form */}
        <Card className="border-2 border-primary mb-8">
          <CardHeader>
            <CardTitle>กรอกข้อมูลเพื่อตรวจสอบ</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>หมายเลขคำสั่งซื้อ</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ORD-1234567890"
                          className="border-2 border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                          className="border-2 border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full border-2 border-primary"
                  disabled={trackMutation.isPending}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {trackMutation.isPending ? 'กำลังค้นหา...' : 'ค้นหา'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <Card className="border-2 border-primary">
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

              {/* Items */}
              <div>
                <h3 className="font-bold mb-3">รายการสินค้า</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex gap-3 p-3 border-2 border-primary">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover border-2 border-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.name}</p>
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

              {/* Summary */}
              <div className="space-y-2 pt-4 border-t-2 border-primary">
                <div className="flex justify-between">
                  <span>ราคาสินค้า</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-primary">
                  <span>ยอดรวม</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-4 border-t-2 border-primary">
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
