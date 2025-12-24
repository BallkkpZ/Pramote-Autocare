import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, ShieldCheck, ShoppingCart, Package, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  // กรณีที่ยังไม่ได้ Login หรือข้อมูลหาย
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-md mx-auto border-2 border-primary">
          <CardContent className="pt-10 space-y-4">
            <ShieldCheck className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">กรุณาเข้าสู่ระบบอีกครั้ง</h2>
            <p className="text-muted-foreground">เพื่อความปลอดภัย ระบบต้องการให้คุณยืนยันตัวตนใหม่</p>
            <Button className="w-full" onClick={() => navigate('/login')}>ไปยังหน้าเข้าสู่ระบบ</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">บัญชีของฉัน</h1>
          <p className="text-muted-foreground">ยินดีต้อนรับคุณ {user.name}</p>
        </div>
        <Button variant="destructive" onClick={() => { logout(); navigate('/'); }}>
          <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* คอลัมน์ซ้าย: ข้อมูลโปรไฟล์ (จาก Cognito) */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-2 border-primary shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/10 border-b-2 border-primary">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" /> โปรไฟล์ผู้ใช้งาน
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full"><User className="h-6 w-6 text-primary" /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">ชื่อที่บันทึก</p>
                  <p className="font-medium text-lg">{user.name}</p>
                </div>
              </div>
              <div className="flex items