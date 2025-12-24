import { Link } from 'react-router-dom';
import { Truck, RotateCcw, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/products';
import { ProductCard } from '@/components/products/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import heroCars from '@/assets/hero-cars.jpg';

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const categories = [
    { name: 'น้ำมันเครื่อง', slug: 'Oil', icon: '🛢️' },
    { name: 'ไส้กรอง', slug: 'Filters', icon: '🔧' },
    { name: 'เบรก', slug: 'Brakes', icon: '🛑' },
    { name: 'แบตเตอรี่', slug: 'Battery', icon: '🔋' },
    { name: 'ยาง', slug: 'Tires', icon: '⚫' },
    { name: 'น้ำยา', slug: 'Coolant', icon: '💧' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCars})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/70" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            AutoCare Parts Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            ศูนย์รวมอะไหล่และเครื่องอุปโภคบริโภคสำหรับรถยนต์คุณภาพสูง
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg border-2 border-primary-foreground shadow-xl"
          >
            <Link to="/products">
              ดูสินค้าทั้งหมด
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b-2 border-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">ส่งฟรี ครบ ฿1,000</h3>
                <p className="text-sm text-muted-foreground">
                  จัดส่งฟรีทั่วประเทศเมื่อซื้อครบ 1,000 บาท
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <RotateCcw className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">คืนสินค้า 7 วัน</h3>
                <p className="text-sm text-muted-foreground">
                  รับประกันคืนสินค้าภายใน 7 วัน หากไม่พอใจ
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">อะไหล่คุณภาพ</h3>
                <p className="text-sm text-muted-foreground">
                  สินค้าแท้ คุณภาพมาตรฐาน OEM และหลังการขาย
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">หมวดหมู่สินค้า</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group"
              >
                <Card className="border-2 border-primary hover:shadow-md transition-shadow">
                  <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-bold text-center group-hover:underline">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">สินค้าแนะนำ</h2>
            <Button asChild variant="outline" className="border-2 border-primary">
              <Link to="/products">ดูทั้งหมด</Link>
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
