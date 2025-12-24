import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Package, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items, updateQuantity, removeItem } = useCartStore();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
        <Button onClick={() => navigate('/login')}>ไปหน้าเข้าสู่ระบบ</Button>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">บัญชีของฉัน</h1>
          <p className="text-muted-foreground">ยินดีต้อนรับคุณ {user.name}</p>
        </div>
        <Button variant="destructive" onClick={() => { logout(); navigate('/'); }}>ออกจากระบบ</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* ส่วนที่ 1: ข้อมูลโปรไฟล์ */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-2 border-primary shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" /> ข้อมูลส่วนตัว
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ-นามสกุล</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">อีเมล</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <Button variant="outline" className="w-full border-primary" onClick={() => navigate('/account/orders')}>
                <Package className="mr-2 h-4 w-4" /> ประวัติการสั่งซื้อ
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ส่วนที่ 2: จัดการตะกร้าสินค้า */}
        <div className="md:col-span-2">
          <Card className="border-2 border-primary shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" /> สินค้าในตะกร้าปัจจุบัน
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <p className="mb-4 text-muted-foreground">ไม่มีสินค้าในตะกร้า</p>
                  <Button onClick={() => navigate('/products')}>ไปช้อปปิ้งเลย</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-sm text-primary">฿{item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-primary rounded-md">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 flex justify-between items-center font-bold text-xl">
                    <span>ยอดรวมทั้งหมด:</span>
                    <span className="text-primary">฿{subtotal.toLocaleString()}</span>
                  </div>
                  <Button className="w-full h-12 text-lg" onClick={() => navigate('/checkout')}>ชำระเงินสินค้า</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}