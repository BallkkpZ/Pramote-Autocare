import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, ShieldCheck } from 'lucide-react';

export default function Account() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">สถานะการเข้าสู่ระบบขัดข้อง</h2>
        <Button onClick={() => window.location.href = '/login'}>เข้าสู่ระบบอีกครั้ง</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto border-2 border-primary shadow-xl">
        <CardHeader className="bg-primary/10 border-b-2 border-primary">
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6" /> ข้อมูลบัญชีผู้ใช้
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">ชื่อสมาชิก</p>
              <p className="text-lg font-bold">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">อีเมลติดต่อ</p>
              <p className="text-lg font-bold">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">ระดับสมาชิก</p>
              <p className="text-lg font-bold text-green-600">{user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}