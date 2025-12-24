import { Check } from 'lucide-react';
import { OrderStatus } from '@/types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const steps: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'รอดำเนินการ' },
  { status: 'confirmed', label: 'ยืนยันแล้ว' },
  { status: 'processing', label: 'กำลังจัดเตรียม' },
  { status: 'shipped', label: 'จัดส่งแล้ว' },
  { status: 'delivered', label: 'ส่งสำเร็จ' },
];

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-destructive/10 border-2 border-destructive p-4 text-center">
        <p className="font-bold">คำสั่งซื้อถูกยกเลิก</p>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.status} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-background'
                  }`}
                >
                  {isActive && <Check className="h-5 w-5" />}
                </div>
                <p className="text-xs mt-2 text-center max-w-[80px]">{step.label}</p>
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 border-t-2 ${
                    index < currentIndex ? 'border-primary' : 'border-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
