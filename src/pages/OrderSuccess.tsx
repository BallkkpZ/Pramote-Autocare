import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="border-2 border-primary max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12" />
          </div>

          <h1 className="text-3xl font-bold mb-4">สั่งซื้อสำเร็จ!</h1>

          {orderNumber && (
            <p className="text-lg mb-2">
              หมายเลขคำสั่งซื้อ: <span className="font-bold">{orderNumber}</span>
            </p>
          )}

          <p className="text-muted-foreground mb-8">
            ขอบคุณที่ใช้บริการ AutoCare Parts Store<br />
            เราจะดำเนินการจัดส่งสินค้าของคุณโดยเร็วที่สุด
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="border-2 border-primary">
              <Link to="/account/orders">ดูคำสั่งซื้อของฉัน</Link>
            </Button>

            <Button asChild className="border-2 border-primary">
              <Link to="/products">เลือกซื้อสินค้าต่อ</Link>
            </Button>
          </div>

          {orderNumber && (
            <p className="text-sm text-muted-foreground mt-6">
              คุณสามารถตรวจสอบสถานะการจัดส่งได้ที่{' '}
              <Link to="/track-order" className="underline font-medium">
                ตรวจสอบสถานะ
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
