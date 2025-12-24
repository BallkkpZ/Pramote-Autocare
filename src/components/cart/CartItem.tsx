import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/stores/cart-store';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQty: number) => {
    const qty = Math.min(Math.max(1, newQty), item.stockQty);
    updateQuantity(item.productId, qty);
  };

  return (
    <div className="flex gap-4 py-4 border-b-2 border-primary">
      <Link to={`/products/${item.slug}`} className="shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover border-2 border-primary"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.slug}`}>
          <h3 className="font-bold mb-1 hover:underline">{item.name}</h3>
        </Link>
        <p className="text-sm font-bold mb-2">{formatPrice(item.price)}</p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-8 w-8 border-2 border-primary"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <Input
            type="number"
            min="1"
            max={item.stockQty}
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 text-center border-2 border-primary"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stockQty}
            className="h-8 w-8 border-2 border-primary"
          >
            <Plus className="h-3 w-3" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => removeItem(item.productId)}
            className="h-8 w-8 border-2 border-primary ml-auto"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}
