import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ข้อมูลจำลอง (Mock Data) สำหรับช่วงที่ยังไม่มี DynamoDB
const MOCK_ORDERS = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    createdAt: new Date().toISOString(),
    status: 'DELIVERED',
    items: [1, 2],
    total: 1250
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    createdAt: new Date().toISOString(),
    status: 'PROCESSING',
    items: [1],
    total: 450
  }
];

export default function AccountOrders() {
  // เปลี่ยนจากดึง API จริง มาใช้ Mock Data ก่อน
  const orders = MOCK_ORDERS; 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/account">
           <Button variant="ghost">← กลับ</Button>
        </Link>
        <h1 className="text-3xl font-bold">คำสั่งซื้อของฉัน</h1>
      </div>

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
                        {new Date(order.createdAt).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-blue-500'}>
                        {order.status === 'DELIVERED' ? 'จัดส่งสำเร็จ' : 'กำลังเตรียมสินค้า'}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {order.items.length} รายการ
                    </span>
                    <span className="font-bold text-lg text-primary">
                      ฿{order.total.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-primary max-w-md mx-auto">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">คุณยังไม่มีคำสั่งซื้อ</p>
            <Link to="/products">
              <Button className="w-full">เลือกซื้อสินค้า</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}