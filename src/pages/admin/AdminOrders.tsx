import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getOrders, updateOrderStatus } from '@/api/orders';
import { OrderStatus } from '@/types';
import { formatPrice, formatDateTime } from '@/lib/format';
import { toast } from 'sonner';

function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('อัปเดตสถานะสำเร็จ');
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    },
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="icon" className="border-2 border-primary">
          <Link to="/admin">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">จัดการคำสั่งซื้อ</h1>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                    <p className="text-sm mt-1">
                      ลูกค้า: {order.shippingAddress.fullName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg mb-2">{formatPrice(order.total)}</p>
                    <Select
                      value={order.status}
                      onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-48 border-2 border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-primary">
                        <SelectItem value="pending">รอดำเนินการ</SelectItem>
                        <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                        <SelectItem value="processing">กำลังจัดเตรียม</SelectItem>
                        <SelectItem value="shipped">จัดส่งแล้ว</SelectItem>
                        <SelectItem value="delivered">ส่งสำเร็จ</SelectItem>
                        <SelectItem value="cancelled">ยกเลิก</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>รายการ: {order.items.length} สินค้า</p>
                  <p>
                    ที่อยู่: {order.shippingAddress.district}, {order.shippingAddress.province}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-primary">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">ไม่มีคำสั่งซื้อ</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdminOrders() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminOrdersPage />
    </ProtectedRoute>
  );
}
