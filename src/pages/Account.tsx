import { Link } from 'react-router-dom';
import { User, Package, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AccountPage() {
  const { session } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">บัญชีของฉัน</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="border-2 border-primary hover:shadow-md transition-shadow">
          <Link to="/account/orders">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">คำสั่งซื้อของฉัน</h3>
                    <p className="text-sm text-muted-foreground">ดูประวัติการสั่งซื้อ</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-2 border-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted text-foreground flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">ข้อมูลส่วนตัว</h3>
                <p className="text-sm text-muted-foreground">{session?.user.name}</p>
                <p className="text-sm text-muted-foreground">{session?.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Account() {
  return (
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  );
}
