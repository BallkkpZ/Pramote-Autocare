import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      quantity: 1,
      stockQty: product.stock,
    });

    toast.success('เพิ่มสินค้าลงตะกร้าแล้ว');
  };

  const getStockBadge = () => {
    if (product.stock === 0) {
      return (
        <Badge variant="destructive" className="absolute top-2 right-2">
          สินค้าหมด
        </Badge>
      );
    }
    if (product.stock <= 5) {
      return (
        <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-500 text-black border-2 border-primary">
          เหลือน้อย
        </Badge>
      );
    }
    return null;
  };

  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="border-2 border-primary hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative aspect-square bg-muted">
          <img
            src={product.images[0]?.url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {getStockBadge()}
        </div>

        <CardContent className="flex-1 p-4">
          <div className="mb-2">
            <Badge variant="outline" className="border-primary">
              {product.category}
            </Badge>
          </div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-xl">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full border-2 border-primary"
            variant={product.stock === 0 ? 'secondary' : 'default'}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? 'สินค้าหมด' : 'ใส่ตะกร้า'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
