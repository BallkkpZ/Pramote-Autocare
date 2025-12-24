import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HelpPageProps {
  title: string;
  children: React.ReactNode;
}

export function HelpPage({ title, children }: HelpPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <Card className="border-2 border-primary">
          <CardContent className="p-8 prose prose-sm max-w-none">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Shipping() {
  return (
    <HelpPage title="การจัดส่ง">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">ค่าจัดส่ง</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>ส่งฟรีเมื่อซื้อครบ 1,000 บาท</li>
            <li>ค่าจัดส่ง 60 บาท สำหรับคำสั่งซื้อต่ำกว่า 1,000 บาท</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">ระยะเวลาจัดส่ง</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>กรุงเทพและปริมณฑล: 1-2 วันทำการ</li>
            <li>ต่างจังหวัด: 2-3 วันทำการ</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">บริษัทขนส่ง</h2>
          <p>เราใช้บริการขนส่งที่เชื่อถือได้ เช่น Kerry Express, Flash Express และ Thailand Post</p>
        </section>
      </div>
    </HelpPage>
  );
}

export function Payment() {
  return (
    <HelpPage title="การชำระเงิน">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">ช่องทางการชำระเงิน</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>QR Payment / โอนเงิน:</strong> สามารถชำระผ่าน QR Code หรือโอนเข้าบัญชี</li>
            <li><strong>บัตรเครดิต/เดบิต:</strong> รองรับบัตรทุกธนาคาร</li>
            <li><strong>ชำระเงินปลายทาง (COD):</strong> ชำระเมื่อได้รับสินค้า</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">ความปลอดภัย</h2>
          <p>การชำระเงินของคุณปลอดภัย เราใช้ระบบเข้ารหัส SSL เพื่อปกป้องข้อมูลการทำธุรกรรม</p>
        </section>
      </div>
    </HelpPage>
  );
}

export function Returns() {
  return (
    <HelpPage title="การคืนสินค้า">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">นโยบายการคืนสินค้า</h2>
          <p>เรารับคืนสินค้าภายใน 7 วันนับจากวันที่ได้รับสินค้า</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">เงื่อนไขการคืนสินค้า</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>สินค้ายังอยู่ในสภาพเดิม ไม่ได้ใช้งาน</li>
            <li>มีกล่องและบรรจุภัณฑ์ครบถ้วน</li>
            <li>มีใบเสร็จหรือหลักฐานการสั่งซื้อ</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">ขั้นตอนการคืนสินค้า</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>ติดต่อฝ่ายบริการลูกค้า</li>
            <li>ส่งสินค้ากลับมาที่บริษัท</li>
            <li>เราจะตรวจสอบสินค้าและคืนเงินภายใน 7 วันทำการ</li>
          </ol>
        </section>
      </div>
    </HelpPage>
  );
}

export function Terms() {
  return (
    <HelpPage title="เงื่อนไขการใช้งาน">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">การใช้งานเว็บไซต์</h2>
          <p>เมื่อคุณใช้บริการของเรา คุณตกลงที่จะปฏิบัติตามเงื่อนไขการใช้งานนี้</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">การสร้างบัญชี</h2>
          <p>คุณต้องให้ข้อมูลที่ถูกต้องและเป็นปัจจุบันเมื่อสร้างบัญชี</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">ความรับผิดชอบ</h2>
          <p>คุณรับผิดชอบในการรักษาความปลอดภัยของบัญชีและรหัสผ่านของคุณ</p>
        </section>
      </div>
    </HelpPage>
  );
}

export function Privacy() {
  return (
    <HelpPage title="นโยบายความเป็นส่วนตัว">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">การเก็บรวบรวมข้อมูล</h2>
          <p>เราเก็บข้อมูลส่วนบุคคลที่จำเป็นสำหรับการให้บริการเท่านั้น</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">การใช้ข้อมูล</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>ดำเนินการตามคำสั่งซื้อของคุณ</li>
            <li>ปรับปรุงบริการของเรา</li>
            <li>ส่งข้อมูลโปรโมชั่น (หากคุณยินยอม)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">ความปลอดภัยของข้อมูล</h2>
          <p>เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ</p>
        </section>
      </div>
    </HelpPage>
  );
}
