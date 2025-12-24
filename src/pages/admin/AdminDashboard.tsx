import { Link } from 'react-router-dom';
import { Package, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <Link to="/admin/products">
          <Card className="border-2 border-primary hover:shadow-md transition-shadow">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">จัดการสินค้า</h2>
              <p className="text-sm text-muted-foreground">
                เพิ่ม แก้ไข ลบสินค้า
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/orders">
          <Card className="border-2 border-primary hover:shadow-md transition-shadow">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">จัดการคำสั่งซื้อ</h2>
              <p className="text-sm text-muted-foreground">
                ดูและอัปเดตสถานะคำสั่งซื้อ
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardPage />
    </ProtectedRoute>
  );
}
