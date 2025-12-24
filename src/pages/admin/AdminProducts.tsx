import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getProducts } from '@/api/products';
import { formatPrice } from '@/lib/format';

function AdminProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="border-2 border-primary">
            <Link to="/admin">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">จัดการสินค้า</h1>
        </div>

        <Button className="border-2 border-primary">
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {products?.map((product) => (
            <Card key={product.id} className="border-2 border-primary">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={product.images[0]?.url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-24 h-24 object-cover border-2 border-primary"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-primary">
                          {product.category}
                        </Badge>
                        {product.stock === 0 ? (
                          <Badge variant="destructive">สินค้าหมด</Badge>
                        ) : product.stock <= 5 ? (
                          <Badge variant="secondary">เหลือน้อย</Badge>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">{formatPrice(product.price)}</p>
                        <p className="text-sm text-muted-foreground">
                          สต็อก: {product.stock} ชิ้น
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-2 border-primary">
                          แก้ไข
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-destructive text-destructive"
                        >
                          ลบ
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminProducts() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminProductsPage />
    </ProtectedRoute>
  );
}
