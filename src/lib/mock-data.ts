import { Product, User, Order } from '@/types';
import engineOilFront from '@/assets/products/engine-oil-front.jpg';
import engineOilSide from '@/assets/products/engine-oil-side.jpg';
import airFilterFront from '@/assets/products/air-filter-front.jpg';
import airFilterSide from '@/assets/products/air-filter-side.jpg';
import brakePadsFront from '@/assets/products/brake-pads-front.jpg';
import brakePadsDetail from '@/assets/products/brake-pads-detail.jpg';
import coolantFront from '@/assets/products/coolant-front.jpg';
import coolantSide from '@/assets/products/coolant-side.jpg';
import batteryFront from '@/assets/products/battery-front.jpg';
import batteryTop from '@/assets/products/battery-top.jpg';
import tireFront from '@/assets/products/tire-front.jpg';
import tireSide from '@/assets/products/tire-side.jpg';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'engine-oil-5w30-4l',
    sku: 'OIL-530-4L',
    name: 'น้ำมันเครื่องสังเคราะห์ 5W-30 (4L)',
    description: 'น้ำมันเครื่องสังเคราะห์แท้ 100% คุณภาพพรีเมียม เหมาะสำหรับเครื่องยนต์เบนซินทั่วไป ช่วยลดการสึกหรอ เพิ่มประสิทธิภาพเครื่องยนต์',
    price: 1290,
    stock: 25,
    category: 'Oil',
    brand: 'AutoCare',
    images: [
      {
        id: '1-1',
        url: engineOilFront,
        alt: 'น้ำมันเครื่องสังเคราะห์ 5W-30 ด้านหน้า',
        isPrimary: true,
      },
      {
        id: '1-2',
        url: engineOilSide,
        alt: 'น้ำมันเครื่องสังเคราะห์ 5W-30 มุมข้าง',
        isPrimary: false,
      },
    ],
    compatibility: [
      { carBrand: 'Toyota', carModel: 'Altis', yearFrom: 2014, yearTo: 2018 },
      { carBrand: 'Honda', carModel: 'Civic', yearFrom: 2016, yearTo: 2020 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'air-filter-oem',
    sku: 'FLT-AIR-OEM',
    name: 'ไส้กรองอากาศ (มาตรฐาน OEM)',
    description: 'ไส้กรองอากาศคุณภาพ OEM กรองฝุ่นได้ดี เพิ่มประสิทธิภาพการเผาไหม้ ยืดอายุการใช้งานเครื่องยนต์',
    price: 390,
    stock: 50,
    category: 'Filters',
    brand: 'Filtra',
    images: [
      {
        id: '2-1',
        url: airFilterFront,
        alt: 'ไส้กรองอากาศ OEM ด้านหน้า',
        isPrimary: true,
      },
      {
        id: '2-2',
        url: airFilterSide,
        alt: 'ไส้กรองอากาศ OEM มุมข้าง',
        isPrimary: false,
      },
    ],
    compatibility: [
      { carBrand: 'Toyota', carModel: 'Vios', yearFrom: 2013, yearTo: 2018 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'front-brake-pads-ceramic',
    sku: 'BRK-F-CER',
    name: 'ผ้าเบรกหน้า เซรามิก',
    description: 'ผ้าเบรกเซรามิกคุณภาพสูง เบรกนิ่ม ไม่ส่งเสียง ฝุ่นน้อย ทนทานกว่าผ้าเบรกธรรมดา 2 เท่า',
    price: 890,
    stock: 18,
    category: 'Brakes',
    brand: 'StopPro',
    images: [
      {
        id: '3-1',
        url: brakePadsFront,
        alt: 'ผ้าเบรกหน้า เซรามิก พร้อมกล่อง',
        isPrimary: true,
      },
      {
        id: '3-2',
        url: brakePadsDetail,
        alt: 'ผ้าเบรกหน้า เซรามิก รายละเอียด',
        isPrimary: false,
      },
    ],
    compatibility: [
      { carBrand: 'Honda', carModel: 'Civic', yearFrom: 2016, yearTo: 2020 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    slug: 'coolant-ll-2l',
    sku: 'CLNT-LL-2L',
    name: 'น้ำยาหม้อน้ำ Long Life Coolant 2L',
    description: 'น้ำยาหม้อน้ำอายุยาว ป้องกันการเป็นสนิม ระบายความร้อนดี เหมาะกับทุกรุ่น ทุกยี่ห้อ',
    price: 320,
    stock: 40,
    category: 'Coolant',
    brand: 'CoolMax',
    images: [
      {
        id: '4-1',
        url: coolantFront,
        alt: 'น้ำยาหม้อน้ำ Long Life 2L ด้านหน้า',
        isPrimary: true,
      },
      {
        id: '4-2',
        url: coolantSide,
        alt: 'น้ำยาหม้อน้ำ Long Life 2L มุมข้าง',
        isPrimary: false,
      },
    ],
    compatibility: [
      { carBrand: 'Universal', carModel: 'All', yearFrom: 2000, yearTo: 2025 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    slug: 'car-battery-65ah-smf',
    sku: 'BAT-65-SMF',
    name: 'แบตเตอรี่รถยนต์ 65Ah SMF',
    description: 'แบตเตอรี่ชนิดไม่ต้องเติมน้ำ กำลังไฟ 65Ah เหมาะกับรถยนต์ขนาดกลาง รับประกัน 1 ปี',
    price: 2890,
    stock: 12,
    category: 'Battery',
    brand: 'VoltOne',
    images: [
      {
        id: '5-1',
        url: batteryFront,
        alt: 'แบตเตอรี่รถยนต์ 65Ah SMF ด้านหน้า',
        isPrimary: true,
      },
      {
        id: '5-2',
        url: batteryTop,
        alt: 'แบตเตอรี่รถยนต์ 65Ah SMF มุมบน',
        isPrimary: false,
      },
    ],
    compatibility: [
      { carBrand: 'Toyota', carModel: 'Corolla', yearFrom: 2014, yearTo: 2020 },
      { carBrand: 'Honda', carModel: 'Civic', yearFrom: 2014, yearTo: 2020 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    slug: 'tire-205-55r16',
    sku: 'TIRE-2055516',
    name: 'ยางรถยนต์ 205/55R16 (1 เส้น)',
    description: 'ยางรถยนต์คุณภาพดี ขนาด 205/55R16 เกาะถนนดี ทนทาน เงียบ ลดการสั่นสะเทือน',
    price: 2450,
    stock: 30,
    category: 'Tires',
    brand: 'RoadGrip',
    images: [
      {
        id: '6-1',
        url: tireFront,
        alt: 'ยางรถยนต์ 205/55R16 ด้านหน้า',
        isPrimary: true,
      },
      {
        id: '6-2',
        url: tireSide,
        alt: 'ยางรถยนต์ 205/55R16 ด้านข้าง',
        isPrimary: false,
      },
    ],
    compatibility: [
      { carBrand: 'Mazda', carModel: '3', yearFrom: 2015, yearTo: 2018 },
      { carBrand: 'Toyota', carModel: 'Corolla Altis', yearFrom: 2014, yearTo: 2018 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'user@demo.com',
    name: 'Demo User',
    role: 'USER',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_ORDERS: Order[] = [];
