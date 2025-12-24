import { request, isUseMock } from './client';
import { Order, Address, OrderStatus, TrackOrderRequest } from '@/types';
import { MOCK_ORDERS } from '@/lib/mock-data';

export async function createOrder(data: {
  shippingAddress: Address;
  paymentMethod: string;
}): Promise<Order> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const orderNumber = `ORD-${Date.now()}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      userId: 'user-1',
      items: [],
      subtotal: 0,
      shippingFee: 60,
      total: 60,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_ORDERS.push(newOrder);

    return newOrder;
  }

  return request<Order>('/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrders(): Promise<Order[]> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...MOCK_ORDERS].reverse();
  }

  return request<Order[]>('/orders');
}

export async function getOrderById(id: string): Promise<Order> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  return request<Order>(`/orders/${id}`);
}

export async function trackOrder(data: TrackOrderRequest): Promise<Order> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const order = MOCK_ORDERS.find((o) => o.orderNumber === data.orderNumber);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  return request<Order>('/track-order', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  return request<Order>(`/admin/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
