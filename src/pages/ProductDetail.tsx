import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Minus, Plus, Package, Truck, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getProductBySlug } from '@/api/products';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/format';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h1>
        <Button asChild variant="outline" className="border-2 border-primary">
          <Link to="/products">กลับไปหน้าสินค้า</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('สินค้าหมด');
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '/placeholder.svg',
      quantity,
      stockQty: product.stock,
    });

    toast.success('เพิ่มสินค้าลงตะกร้าแล้ว');
  };

  const handleQuantityChange = (newQty: number) => {
    setQuantity(Math.min(Math.max(1, newQty), product.stock));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <ProductImageGallery images={product.images} productName={product.name} />

        {/* Details */}
        <div>
          <div className="mb-4">
            <Badge variant="outline" className="border-primary mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-sm">
              สถานะ:{' '}
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  มีสินค้า ({product.stock} ชิ้น)
                </span>
              ) : (
                <span className="text-destructive font-medium">สินค้าหมด</span>
              )}
            </p>
          </div>

          <Separator className="my-6 h-0.5 bg-primary" />

          <div className="mb-6">
            <h2 className="font-bold mb-2">รายละเอียดสินค้า</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.compatibility.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold mb-2">รุ่นรถที่รองรับ</h2>
              <div className="flex flex-wrap gap-2">
                {product.compatibility.map((comp, index) => (
                  <Badge key={index} variant="secondary" className="border-2 border-primary">
                    {comp.carBrand} {comp.carModel} ({comp.yearFrom}-{comp.yearTo})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-6 h-0.5 bg-primary" />

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || product.stock === 0}
                  className="border-2 border-primary"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  disabled={product.stock === 0}
                  className="w-20 text-center border-2 border-primary"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || product.stock === 0}
                  className="border-2 border-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 border-2 border-primary"
                size="lg"
              >
                {product.stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 border-primary">
          <CardContent className="flex items-start gap-4 p-6">
            <Truck className="h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">การจัดส่ง</h3>
              <p className="text-sm text-muted-foreground">
                ส่งฟรีเมื่อซื้อครบ ฿1,000 <Link to="/help/shipping" className="underline">รายละเอียด</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardContent className="flex items-start gap-4 p-6">
            <RotateCcw className="h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">การคืนสินค้า</h3>
              <p className="text-sm text-muted-foreground">
                คืนได้ภายใน 7 วัน <Link to="/help/returns" className="underline">รายละเอียด</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardContent className="flex items-start gap-4 p-6">
            <Package className="h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-1">คุณภาพสินค้า</h3>
              <p className="text-sm text-muted-foreground">
                สินค้าแท้ มาตรฐาน OEM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
