import { request, isUseMock } from './client';
import { Cart, CartItem } from '@/types';

let mockCart: CartItem[] = [];

export async function getCart(): Promise<Cart> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const subtotal = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 1000 ? 0 : 60;
    const total = subtotal + shippingFee;

    return {
      items: mockCart,
      subtotal,
      shippingFee,
      total,
    };
  }

  return request<Cart>('/cart');
}

export async function addToCart(item: CartItem): Promise<Cart> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const existingIndex = mockCart.findIndex((i) => i.productId === item.productId);

    if (existingIndex !== -1) {
      mockCart[existingIndex].quantity = Math.min(
        mockCart[existingIndex].quantity + item.quantity,
        item.stockQty
      );
    } else {
      mockCart.push(item);
    }

    return getCart();
  }

  return request<Cart>('/cart/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const item = mockCart.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.min(Math.max(1, quantity), item.stockQty);
    }

    return getCart();
  }

  return request<Cart>(`/cart/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(productId: string): Promise<Cart> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    mockCart = mockCart.filter((i) => i.productId !== productId);

    return getCart();
  }

  return request<Cart>(`/cart/items/${productId}`, {
    method: 'DELETE',
  });
}

export async function mergeCart(guestCart: CartItem[]): Promise<Cart> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Merge guest cart into mock cart
    guestCart.forEach((guestItem) => {
      const existingIndex = mockCart.findIndex((i) => i.productId === guestItem.productId);

      if (existingIndex !== -1) {
        mockCart[existingIndex].quantity = Math.min(
          mockCart[existingIndex].quantity + guestItem.quantity,
          guestItem.stockQty
        );
      } else {
        mockCart.push(guestItem);
      }
    });

    return getCart();
  }

  return request<Cart>('/cart/merge', {
    method: 'POST',
    body: JSON.stringify({ items: guestCart }),
  });
}

export function clearMockCart() {
  mockCart = [];
}
