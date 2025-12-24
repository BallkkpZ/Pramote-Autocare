import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createInquiry } from '@/api/inquiries';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ').max(100),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง').max(255),
  subject: z.string().min(1, 'กรุณากรอกหัวข้อ').max(200),
  message: z.string().min(1, 'กรุณากรอกข้อความ').max(1000),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createInquiry,
    onSuccess: () => {
      toast.success('ส่งข้อความสำเร็จ เราจะติดต่อกลับโดยเร็วที่สุด');
      form.reset();
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาดในการส่งข้อความ');
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ติดต่อเรา</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>ข้อมูลติดต่อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">ที่อยู่</h3>
                <p className="text-sm text-muted-foreground">
                  123 ถนนราชดำเนิน แขวงสามแยกติ่งอี่<br />
                  เขตราชเทวี กรุงเทพมหานคร 10400
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-1">โทรศัพท์</h3>
                <p className="text-sm text-muted-foreground">02-XXX-XXXX</p>
              </div>

              <div>
                <h3 className="font-bold mb-1">อีเมล</h3>
                <p className="text-sm text-muted-foreground">support@autocare.com</p>
              </div>

              <div>
                <h3 className="font-bold mb-1">เวลาทำการ</h3>
                <p className="text-sm text-muted-foreground">
                  จันทร์ - เสาร์: 9:00 - 18:00<br />
                  อาทิตย์: ปิดทำการ
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>ส่งข้อความหาเรา</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>อีเมล *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>หัวข้อ *</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ข้อความ *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} className="border-2 border-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full border-2 border-primary"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
