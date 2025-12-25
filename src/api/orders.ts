import { isUseMock } from './client';
import { Order, Address, OrderStatus, TrackOrderRequest } from '@/types';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { post, get } from 'aws-amplify/api';

const API_NAME = 'orderApi';

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

  const operation = post({
    apiName: API_NAME,
    path: '/orders', // Assuming Checkout.tsx used this path initially, ensuring consistency
    options: {
      body: data
    }
  });

  const { body } = await operation.response;
  return (await body.json()) as Order;
}

export async function getOrders(): Promise<Order[]> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...MOCK_ORDERS].reverse();
  }

  const operation = get({
    apiName: API_NAME,
    path: '/orders'
  });

  const { body } = await operation.response;
  return (await body.json()) as Order[];
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

  const operation = get({
    apiName: API_NAME,
    path: `/orders/${id}`
  });

  const { body } = await operation.response;
  return (await body.json()) as Order;
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

  const operation = post({
    apiName: API_NAME,
    path: '/track-order',
    options: {
      body: data
    }
  });

  const { body } = await operation.response;
  return (await body.json()) as Order;
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

  const operation = post({ // Note: Using POST or PATCH depending on API design. AWS Gateway usually easy with POST or ANY. Keeping PATCH semantic if supported, but Amplify `patch` helper exists? Yes. Let's use `patch` to match original intent, but need to import it.
    apiName: API_NAME,
    path: `/admin/orders/${id}`,
    options: {
      body: { status }
    }
  });

  const { body } = await operation.response;
  return (await body.json()) as Order;
}
