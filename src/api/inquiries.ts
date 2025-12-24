import { request, isUseMock } from './client';
import { Inquiry } from '@/types';

const MOCK_INQUIRIES: Inquiry[] = [];

export async function createInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<Inquiry> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const inquiry: Inquiry = {
      id: `inquiry-${Date.now()}`,
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    MOCK_INQUIRIES.push(inquiry);

    return inquiry;
  }

  return request<Inquiry>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
