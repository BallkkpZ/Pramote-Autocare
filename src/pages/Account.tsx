import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, ShoppingCart, Package, LogOut, UserCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();
  const { items } = useCartStore();

  // แสดง Loading ระหว่างที่ระบบกำลังตรวจสอบสถานะจาก AWS
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">กำลังโหลดข้อมูลบัญชี...</p>
      </div>
    );
  }

  // หากโหลดเสร็จแล้วแต่ไม่มีข้อมูลผู้ใช้ ค่อยแสดงหน้าให้ไป Login
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-md mx-auto border-2 border-primary">
          <CardContent className="pt-10 space-y-4">
            <UserCircle className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-muted-foreground">เพื่อดูข้อมูลส่วนตัวและจัดการบัญชีของคุณ</p>
            <Button className="w-full h-12 text-lg" onClick={() => navigate('/login')}>ไปยังหน้าเข้าสู่ระบบ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black text-primary uppercase">My Account</h1>
          <p className="text-lg">ยินดีต้อนรับคุณ <span className="font-bold underline text-orange-600">{user.name}</span></p>
        </div>
        <Button variant="destructive" size="lg" onClick={() => { logout(); navigate('/'); }} className="font-bold">
          <LogOut className="mr-2 h-5 w-5" /> ออกจากระบบ
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="bg-primary text-white border-b-2 border-black">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5" /> ข้อมูลโปรไฟล์
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-black">Member Name</p>
                <p className="font-bold text-xl text-gray-800">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-black">Email Address</p>
                <p className="font-medium text-gray-700">{user.email}</p>
              </div>
              <Button className="w-full mt-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" variant="outline" onClick={() => navigate('/account/orders')}>
                <Package className="mr-2 h-5 w-5" /> ประวัติการสั่งซื้อ
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
            <CardHeader className="bg-primary text-white border-b-2 border-black">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> ตะกร้าสินค้าปัจจุบัน
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <ShoppingCart className="h-16 w-16 mx-auto text-gray-300" />
                  <p className="text-muted-foreground text-lg italic">"คุณยังไม่มีสินค้าในตะกร้า"</p>
                  <Button variant="link" className="text-primary font-bold text-lg underline" onClick={() => navigate('/products')}>ไปเลือกช้อปสินค้าเลย!</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-orange-50 border-2 border-primary/20 rounded-lg">
                      <div>
                        <p className="font-black text-lg">{item.name}</p>
                        <p className="text-sm text-primary font-bold">จำนวน: {item.quantity} ชิ้น</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-primary">฿{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-6 flex justify-between items-center text-2xl font-black border-t-4 border-double border-primary">
                    <span>ยอดรวมสุทธิ:</span>
                    <span className="text-primary underline">฿{subtotal.toLocaleString()}</span>
                  </div>
                  <Button className="w-full h-16 text-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black" onClick={() => navigate('/cart')}>
                    จัดการและชำระเงิน
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}