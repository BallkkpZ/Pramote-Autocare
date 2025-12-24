import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t-2 border-primary bg-muted mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">AutoCare Parts</h3>
            <p className="text-sm text-muted-foreground">
              ศูนย์รวมอะไหล่รถยนต์คุณภาพ พร้อมบริการจัดส่งทั่วประเทศ
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">ช่วยเหลือ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help/shipping" className="hover:underline">
                  การจัดส่ง
                </Link>
              </li>
              <li>
                <Link to="/help/payment" className="hover:underline">
                  การชำระเงิน
                </Link>
              </li>
              <li>
                <Link to="/help/returns" className="hover:underline">
                  การคืนสินค้า
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:underline">
                  ตรวจสอบสถานะ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">เกี่ยวกับ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help/terms" className="hover:underline">
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
              <li>
                <Link to="/help/privacy" className="hover:underline">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link to="/help/contact" className="hover:underline">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">ติดต่อเรา</h3>
            <ul className="space-y-2 text-sm">
              <li>โทร: 02-XXX-XXXX</li>
              <li>อีเมล: support@autocare.com</li>
              <li>เวลาทำการ: จ-ส 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-primary text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AutoCare Parts Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
