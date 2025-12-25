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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import { Address } from '@/types';
import { post } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

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
  const { items, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('qr');

  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: session?.user?.name || '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      district: '',
      province: '',
      postalCode: '',
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { shippingAddress: Address; paymentMethod: string }) => {
      const serviceNames = items.map(item => item.name).join(', ');
      const totalAmount = getTotal();
      await fetchAuthSession(); // Ensure session is valid, though built-in signing handles it.


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
      const orderNum = data.orderId || data.id || 'SUCCESS';
      navigate(`/order-success?orderNumber=${orderNum}`);
    },
    onError: (error: any) => {
      console.error('API Error:', error);
      toast.error(`ข้อผิดพลาด: ${error.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'}`);
    },
  });

  const onSubmit = (data: Address) => {
    if (items.length === 0) return;
    createOrderMutation.mutate({ shippingAddress: data, paymentMethod });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">ไม่มีสินค้าในตะกร้า</h1>
        <Button onClick={() => navigate('/products')} className="border-2 border-primary">เลือกซื้อสินค้า</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ชำระเงิน</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-primary">
                <CardHeader><CardTitle>ที่อยู่จัดส่ง</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>ชื่อ-นามสกุล *</FormLabel><FormControl><Input {...field} className="border-2 border-primary" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>เบอร์โทรศัพท์ *</FormLabel><FormControl><Input {...field} type="tel" className="border-2 border-primary" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="addressLine1" render={({ field }) => (
                    <FormItem><FormLabel>ที่อยู่ *</FormLabel><FormControl><Input {...field} className="border-2 border-primary" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="district" render={({ field }) => (
                      <FormItem><FormLabel>เขต/อำเภอ *</FormLabel><FormControl><Input {...field} className="border-2 border-primary" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="province" render={({ field }) => (
                      <FormItem><FormLabel>จังหวัด *</FormLabel><FormControl><Input {...field} className="border-2 border-primary" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="postalCode" render={({ field }) => (
                    <FormItem><FormLabel>รหัสไปรษณีย์ *</FormLabel><FormControl><Input {...field} className="border-2 border-primary" /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
              <Card className="border-2 border-primary">
                <CardHeader><CardTitle>วิธีการชำระเงิน</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border-2 border-primary mb-3">
                      <RadioGroupItem value="qr" id="qr" /><Label htmlFor="qr" className="flex-1 cursor-pointer">QR Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border-2 border-primary">
                      <RadioGroupItem value="cod" id="cod" /><Label htmlFor="cod" className="flex-1 cursor-pointer">เก็บเงินปลายทาง</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="border-2 border-primary sticky top-24">
                <CardHeader><CardTitle>สรุปคำสั่งซื้อ</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>ยอดรวมสุทธิ</span><span>{formatPrice(getTotal())}</span>
                  </div>
                  <Button type="submit" className="w-full text-lg h-12" disabled={createOrderMutation.isPending}>
                    {createOrderMutation.isPending ? 'กำลังสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
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
