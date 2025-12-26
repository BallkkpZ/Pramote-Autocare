import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useState } from 'react';

export function Navbar() {
  const navigate = useNavigate();
  // แก้ไขจุดนี้: ดึง user และ isAuthenticated แทน session
  const { user, isAuthenticated, logout } = useAuthStore();
  const items = useCartStore(state => state.items);
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b-2 border-primary bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="font-bold text-xl md:text-2xl hover:opacity-80">
            Moodeng AutoCare 
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Input type="search" placeholder="ค้นหาสินค้า..." value={search} onChange={e => setSearch(e.target.value)} className="pr-10 border-2 border-primary" />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            {/* เปลี่ยนเงื่อนไขจาก session เป็น isAuthenticated */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-2 border-primary">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-2 border-primary">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.name}
                  </div>
                  <DropdownMenuSeparator className="bg-primary h-0.5" />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    บัญชีของฉัน
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                    คำสั่งซื้อ
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator className="bg-primary h-0.5" />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Admin Panel
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-primary h-0.5" />
                  <DropdownMenuItem onClick={handleLogout}>
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="icon" onClick={() => navigate('/login')} className="border-2 border-primary">
                <User className="h-5 w-5" />
              </Button>
            )}

            <Button variant="outline" size="icon" onClick={() => navigate('/cart')} className="relative border-2 border-primary">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="border-2 border-primary">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l-2 border-primary">
                <nav className="flex flex-col gap-4 mt-8">
                  <form onSubmit={handleSearch} className="mb-4">
                    <Input type="search" placeholder="ค้นหาสินค้า..." value={search} onChange={e => setSearch(e.target.value)} className="border-2 border-primary" />
                  </form>
                  <Link to="/products" className="text-lg font-medium hover:underline" onClick={() => setMobileMenuOpen(false)}>
                    สินค้าทั้งหมด
                  </Link>
                  <Link to="/track-order" className="text-lg font-medium hover:underline" onClick={() => setMobileMenuOpen(false)}>
                    ตรวจสอบสถานะ
                  </Link>
                  <Link to="/help/contact" className="text-lg font-medium hover:underline" onClick={() => setMobileMenuOpen(false)}>
                    ติดต่อเรา
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 py-2 border-t-2 border-primary">
          <Link to="/products" className="font-medium hover:underline">
            สินค้าทั้งหมด
          </Link>
          <Link to="/track-order" className="font-medium hover:underline">
            ตรวจสอบสถานะ
          </Link>
          <Link to="/help/contact" className="font-medium hover:underline">
            ติดต่อเรา
          </Link>
        </nav>
      </div>
    </header>
  );
}
