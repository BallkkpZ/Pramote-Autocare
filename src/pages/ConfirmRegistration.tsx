import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

// --- นำเข้า Auth จาก Amplify ---
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

const schema = z.object({
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  code: z.string().min(6, 'รหัสต้องมี 6 หลัก'),
});

type FormData = z.infer<typeof schema>;

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // พยายามดึงอีเมลจากหน้าที่แล้วถ้ามี
  const defaultEmail = location.state?.email || '';

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: defaultEmail,
      code: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // สั่งยืนยันรหัสผ่าน Amplify Auth
      await confirmSignUp({
        username: data.email,
        confirmationCode: data.code,
      });
      
      toast.success('ยืนยันตัวตนสำเร็จ! กรุณาเข้าสู่ระบบ');
      navigate('/login');
    } catch (error: any) {
      console.error('Confirm error:', error);
      toast.error(error.message || 'รหัสไม่ถูกต้อง หรืออีเมลไม่มีในระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-center">ยืนยันอีเมลของคุณ</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมลที่ใช้สมัคร</FormLabel>
                  <FormControl><Input {...field} placeholder="your@email.com" className="border-2 border-primary" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>กรอกรหัส 6 หลักที่ส่งไปยังอีเมล</FormLabel>
                  <FormControl><Input {...field} placeholder="000000" className="border-2 border-primary" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'กำลังยืนยัน...' : 'ยืนยันรหัส'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}