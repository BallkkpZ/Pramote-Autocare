import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Package, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';

// ข้อมูลจำลอง (Mock Data) ระหว่างรอ DynamoDB
const MOCK_ORDERS = [
  { id: '1', orderNo: 'ORD-681224-001', date: '24 ธ.ค. 2025', status: 'DELIVERED', total: 1550, items: 2 },
  { id: '2', orderNo: 'ORD-681220-009', date: '20 ธ.ค. 2025', status: 'PROCESSING', total: 890, items: 1 }
];

export default function AccountOrders() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" onClick={() => navigate('/account')}>← กลับไปหน้าบัญชี</Button>
        <h1 className="text-3xl font-bold">ประวัติการสั่งซื้อของคุณ</h1>
      </div>

      <div className="space-y-6">
        {MOCK_ORDERS.map((order) => (
          <Card key={order.id} className="border-2 border-primary hover:border-orange-500 transition-all cursor-pointer shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-bold text-lg">{order.orderNo}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>สั่งซื้อเมื่อ: {order.date}</span>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <Badge className={order.status === 'DELIVERED' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}>
                    {order.status === 'DELIVERED' ? 'จัดส่งสำเร็จ' : 'กำลังเตรียมจัดส่ง'}
                  </Badge>
                  <p className="text-2xl font-black text-primary">฿{order.total.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-center border-l md:pl-6">
                  <ChevronRight className="text-primary h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-gray-50 rounded-xl border-2 border-dashed text-center">
        <p className="text-gray-500 text-sm italic">ระบบแสดงเฉพาะรายการสั่งซื้อย้อนหลัง 30 วัน</p>
      </div>
    </div>
  );
}