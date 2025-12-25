import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { signUp } from 'aws-amplify/auth'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'), // แนะนำให้เป็น 8 ตาม Config ของคุณ
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: name, 
          },
          autoSignIn: true 
        }
      });
      return { isSignUpComplete, userId, nextStep };
    },
    onSuccess: (result) => {
      toast.success('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อรับรหัสยืนยัน 6 หลัก');
      
      // แก้ไขจาก /login เป็น /confirm-registration
      // เพื่อให้ผู้ใช้สามารถกรอกรหัส 014888 ที่ได้รับทางอีเมลได้ทันที
      navigate('/confirm-registration'); 
    },
    onError: (error: any) => {
      console.error(error);
      let message = 'สมัครสมาชิกล้มเหลว';
      if (error.name === 'UsernameExistsException') {
        message = 'อีเมลนี้ถูกใช้งานไปแล้ว';
      } else if (error.name === 'InvalidPasswordException') {
        message = 'รหัสผ่านไม่ตรงตามเงื่อนไขความปลอดภัย (ต้องมีพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และสัญลักษณ์)';
      } else {
        message = error.message || message;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: FormData) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="border-2 border-primary max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">สมัครสมาชิก (Cognito)</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ชื่อของคุณ"
                        className="border-2 border-primary"
                      />
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
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        className="border-2 border-primary"
                      />
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
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="border-2 border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยืนยันรหัสผ่าน