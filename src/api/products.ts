import { request, isUseMock } from './client';
import { Product, ProductFilters } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let products = [...MOCK_PRODUCTS];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
      );
    }

    if (filters.category && filters.category.length > 0) {
      products = products.filter((p) => filters.category?.includes(p.category));
    }

    if (filters.brand && filters.brand.length > 0) {
      products = products.filter((p) => filters.brand?.includes(p.brand));
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.inStock) {
      products = products.filter((p) => p.stock > 0);
    }

    if (filters.carBrand || filters.carModel || filters.year) {
      products = products.filter((p) => {
        return p.compatibility.some((c) => {
          const brandMatch = !filters.carBrand || c.carBrand === filters.carBrand;
          const modelMatch = !filters.carModel || c.carModel === filters.carModel;
          const yearMatch =
            !filters.year || (filters.year >= c.yearFrom && filters.year <= c.yearTo);
          return brandMatch && modelMatch && yearMatch;
        });
      });
    }

    // Apply sorting
    switch (filters.sort) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // featured - no change
        break;
    }

    return products;
  }

  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category.join(','));
  if (filters.brand) params.append('brand', filters.brand.join(','));
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.inStock) params.append('inStock', 'true');
  if (filters.carBrand) params.append('carBrand', filters.carBrand);
  if (filters.carModel) params.append('carModel', filters.carModel);
  if (filters.year) params.append('year', filters.year.toString());
  if (filters.sort) params.append('sort', filters.sort);

  return request<Product[]>(`/products?${params.toString()}`);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  return request<Product>(`/products/${slug}`);
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_PRODUCTS.push(newProduct);
    return newProduct;
  }

  return request<Product>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }

    MOCK_PRODUCTS[index] = {
      ...MOCK_PRODUCTS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return MOCK_PRODUCTS[index];
  }

  return request<Product>(`/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  if (isUseMock()) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS.splice(index, 1);
    }
    return;
  }

  return request<void>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}
