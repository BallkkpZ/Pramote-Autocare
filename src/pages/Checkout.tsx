import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import { Address } from '@/types';

// --- นำเข้าเครื่องมือสำหรับเชื่อมต่อ AWS API ---
import { post } from 'aws-amplify/api';

const addressSchema = z.object({
  fullName: z.string().min(1, 'กรุณากรอกชื่อ'),
  phone: z.string().min(10, 'กรุณากรอกเบอร์โทรศัพท์'),
  addressLine1: z.string().min(1, 'กรุณากรอกที่อยู่'),
  addressLine2: z.string().optional(),
  district: z.string().min(1, 'กรุณากรอกเขต/อำเภอ'),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  postalCode: z.string().min(5, 'กรุณากรอกรหัสไปรษณีย์'),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { session } = useAuthStore();
  const { items, getSubtotal, getShippingFee, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('qr');

  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: session?.user.name || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      district: '',
      province: '',
      postalCode: '',
    },
  });

  // --- แก้ไขส่วนการส่งข้อมูลหา AWS Lambda ---
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { shippingAddress: Address; paymentMethod: string }) => {
      // มัดรวมข้อมูลสินค้าในตะกร้า
      const serviceNames = items.map(item => item.name).join(', ');
      const totalAmount = getTotal();

      const restOperation = post({
        apiName: 'orderApi',
        path: '/orders',
        options: {
          body: {
            serviceName: serviceNames,
            totalPrice: totalAmount,
            address: orderData.shippingAddress,
            payment: orderData.paymentMethod
          }
        }
      });

      const { body } = await restOperation.response;
      return await body.json();
    },
    onSuccess: (data: any) => {
      clearCart();
      toast.success('สั่งซื้อสำเร็จ!');
      // นำ Order ID ที่ได้จาก Lambda มาแสดงในหน้า Success
      navigate(`/order-success?orderNumber=${data.orderId}`);
    },
    onError: (error) => {
      toast.error('เกิดข้อผิดพลาดในการสั่งซื้อบน Cloud');
      console.error(error);
    },
  });

  const onSubmit = (data: Address) => {
    if (items.length === 0) {
      toast.error('ไม่มีสินค้าในตะกร้า');
      return;
    }

    createOrderMutation.mutate({
      shippingAddress: data,
      paymentMethod,
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">ไม่มีสินค้าในตะกร้า</h1>
        <Button onClick={() => navigate('/products')} className="border-2 border-primary">
          เลือกซื้อสินค้า
        </Button>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const total = getTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ชำระเงิน</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>ที่อยู่จัดส่ง</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ-นามสกุล *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เบอร์โทรศัพท์ *</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ที่อยู่ *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ที่อยู่ (บรรทัด 2)</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>เขต/อำเภอ *</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-2 border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>จังหวัด *</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-2 border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>รหัสไปรษณีย์ *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle>วิธีการชำระเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border-2 border-primary mb-3">
                      <RadioGroupItem value="qr" id="qr" />
                      <Label htmlFor="qr" className="flex-1 cursor-pointer">
                        QR Payment / โอนเงิน
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border-2 border-primary mb-3">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex-1 cursor-pointer">
                        บัตรเครดิต/เดบิต
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border-2 border-primary">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        ชำระเงินปลายทาง (COD)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-2 border-primary sticky top-24">
                <CardHeader>
                  <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">สินค้า ({items.length})</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ค่าจัดส่ง</span>
                      <span className="font-medium">
                        {shippingFee === 0 ? 'ฟรี' : formatPrice(shippingFee)}
                      </span>
                    </div>

                    <Separator className="h-0.5 bg-primary" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>ยอดรวม</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full border-2 border-primary"
                    size="lg"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}