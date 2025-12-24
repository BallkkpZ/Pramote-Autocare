import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/cart/CartItem';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/format';

export default function Cart() {
  const navigate = useNavigate();
  const { items, getSubtotal, getShippingFee, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-2 border-primary max-w-md mx-auto">
          <CardContent className="flex flex-col items-center text-center p-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
            <p className="text-muted-foreground mb-6">
              คุณยังไม่มีสินค้าในตะกร้า เริ่มต้นช้อปปิ้งเลย!
            </p>
            <Button asChild className="border-2 border-primary">
              <Link to="/products">เลือกซื้อสินค้า</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ตะกร้าสินค้า ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-primary">
            <CardContent className="p-6">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="border-2 border-primary sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ราคาสินค้า</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">ค่าจัดส่ง</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? 'ฟรี' : formatPrice(shippingFee)}
                  </span>
                </div>

                {subtotal < 1000 && (
                  <p className="text-xs text-muted-foreground">
                    ซื้อเพิ่ม {formatPrice(1000 - subtotal)} เพื่อส่งฟรี
                  </p>
                )}

                <Separator className="h-0.5 bg-primary" />

                <div className="flex justify-between text-lg font-bold">
                  <span>ยอดรวม</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full border-2 border-primary"
                size="lg"
              >
                ดำเนินการชำระเงิน
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full mt-3 border-2 border-primary"
              >
                <Link to="/products">เลือกซื้อสินค้าต่อ</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
