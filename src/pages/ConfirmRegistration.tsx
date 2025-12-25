import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

const schema = z.object({
  code: z.string().length(6, 'รหัสยืนยันต้องมี 6 หลัก'),
});

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmRegister } = useAuthStore();
  const email = location.state?.email; // ดึงอีเมลที่ส่งมาจากหน้า Login/Register

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: { code: string }) => {
    if (!email) {
      toast.error('ไม่พบข้อมูลอีเมล กรุณาลองสมัครใหม่');
      return;
    }
    try {
      await confirmRegister(email, data.code);
      toast.success('ยืนยันบัญชีสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'รหัสยืนยันไม่ถูกต้อง');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="border-2 border-primary max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">ยืนยันอีเมลของคุณ</CardTitle>
          <p className="text-center text-sm text-muted-foreground">กรอกรหัส 6 หลักที่ส่งไปยัง {email}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="000000" className="text-center text-2xl tracking-widest border-2 border-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full border-2 border-primary">ยืนยันรหัส</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}