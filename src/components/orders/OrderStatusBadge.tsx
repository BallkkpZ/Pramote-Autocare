import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  pending: { label: 'รอดำเนินการ', variant: 'secondary' },
  confirmed: { label: 'ยืนยันแล้ว', variant: 'default' },
  processing: { label: 'กำลังจัดเตรียม', variant: 'default' },
  shipped: { label: 'จัดส่งแล้ว', variant: 'default' },
  delivered: { label: 'ส่งสำเร็จ', variant: 'default' },
  cancelled: { label: 'ยกเลิก', variant: 'destructive' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="border-2 border-primary">
      {config.label}
    </Badge>
  );
}
