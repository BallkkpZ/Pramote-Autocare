import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore(); 
  const { items: guestItems } = useCartStore();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: FormData) => login(email, password),
    onSuccess: () => {
      toast.success('เข้าสู่ระบบสำเร็จ');
      const from = (location.state as any)?.from?.pathname || '/account';
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      let message = 'เข้าสู่ระบบล้มเหลว';
      if (error.name === 'UserNotConfirmedException') {
        message = 'กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ';
      } else if (error.name === 'NotAuthorizedException') {
        message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="border-2 border-primary max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">เข้าสู่ระบบ (Cognito)</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" className="border-2 border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="••••••" className="border-2 border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full border-2 border-primary" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ยังไม่มีบัญชี? <Link to="/register" className="font-medium underline">สมัครสมาชิก</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}