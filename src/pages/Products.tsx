import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getProducts } from '@/api/products';
import { ProductCard } from '@/components/products/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProductFilters } from '@/types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState<ProductFilters>({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category')?.split(',').filter(Boolean) || [],
    brand: searchParams.get('brand')?.split(',').filter(Boolean) || [],
    sort: (searchParams.get('sort') as any) || 'featured',
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  });

  const categories = ['Oil', 'Filters', 'Brakes', 'Coolant', 'Battery', 'Tires'];
  const brands = ['AutoCare', 'Filtra', 'StopPro', 'CoolMax', 'VoltOne', 'RoadGrip'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: search || undefined });
  };

  const updateFilters = (updates: Partial<ProductFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category?.length) params.set('category', newFilters.category.join(','));
    if (newFilters.brand?.length) params.set('brand', newFilters.brand.join(','));
    if (newFilters.sort) params.set('sort', newFilters.sort);

    setSearchParams(params);
  };

  const toggleCategory = (category: string) => {
    const current = filters.category || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    updateFilters({ category: updated });
  };

  const toggleBrand = (brand: string) => {
    const current = filters.brand || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    updateFilters({ brand: updated });
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-3">หมวดหมู่</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={filters.category?.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">แบรนด์</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brand?.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-2 border-primary"
        onClick={() => {
          setFilters({ sort: filters.sort });
          setSearch('');
          setSearchParams({});
        }}
      >
        ล้างตัวกรอง
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">สินค้าทั้งหมด</h1>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 border-2 border-primary p-4">
            <h2 className="font-bold text-lg mb-4">ตัวกรอง</h2>
            <FiltersContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search & Sort */}
          <div className="mb-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder="ค้นหาสินค้า..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-2 border-primary"
                />
              </div>
              <Button type="submit" className="border-2 border-primary">
                <Search className="h-4 w-4 mr-2" />
                ค้นหา
              </Button>

              {/* Mobile Filter Toggle */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" className="border-2 border-primary">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-r-2 border-primary">
                  <SheetHeader>
                    <SheetTitle>ตัวกรอง</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>
            </form>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'กำลังโหลด...' : `พบ ${products?.length || 0} สินค้า`}
              </p>

              <Select
                value={filters.sort}
                onValueChange={(value: any) => updateFilters({ sort: value })}
              >
                <SelectTrigger className="w-48 border-2 border-primary">
                  <SelectValue placeholder="เรียงตาม" />
                </SelectTrigger>
                <SelectContent className="border-2 border-primary">
                  <SelectItem value="featured">แนะนำ</SelectItem>
                  <SelectItem value="price_asc">ราคา: ต่ำ-สูง</SelectItem>
                  <SelectItem value="price_desc">ราคา: สูง-ต่ำ</SelectItem>
                  <SelectItem value="newest">มาใหม่</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <LoadingSpinner />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">ไม่พบสินค้า</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
