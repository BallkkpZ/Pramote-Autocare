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
  const { items, getSubtotal, getShippingFee, getTotal, clearCart } = useCartStore();
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

  // --- ส่วนการส่งข้อมูลหา AWS Lambda ---
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { shippingAddress: Address; paymentMethod: string }) => {
      // 1. เตรียมข้อมูลสินค้าและยอดรวม
      const serviceNames = items.map(item => item.name).join(', ');
      const totalAmount = getTotal();

      // 2. ดึง Auth Token เพื่อยืนยันตัวตน (ถ้า API ตั้งค่าเป็น Private)
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();

      // 3. เรียกใช้ API ผ่านท่อ orderApi
      const restOperation = post({
        apiName: 'orderApi',
        path: '/orders',
        options: {
          headers: {
            Authorization: idToken || '' 
          },
          body: {
            serviceName: serviceNames,
            totalPrice: totalAmount,
            address: orderData.shippingAddress,
            payment: orderData.paymentMethod
          }
        }
      });

      // 4. รอรับและตรวจสอบสถานะการตอบกลับ
      const response = await restOperation.response;
      
      if (response.statusCode !== 200) {
        const errorData = await response.body.json() as any;
        throw new Error(errorData.message || 'Server error');
      }

      return await response.body.json() as any;
    },
    onSuccess: (data: any) => {
      clearCart();
      toast.success('สั่งซื้อสำเร็จ!');
      // นำ Order ID จาก Lambda มาแสดงในหน้า Success
      navigate(`/order-success?orderNumber=${data.orderId || 'SUCCESS'}`);
    },
    onError: (error: any) => {
      console.error('API Error Details:', error);
      toast.error('เกิดข้อผิดพลาดในการสั่งซื้อบน Cloud กรุณาลองใหม่');
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