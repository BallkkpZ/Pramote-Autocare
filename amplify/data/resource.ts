import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== PRAMOTE AUTOCARE DATABASE SCHEMA ==*/
const schema = a.schema({
  // 1. ตารางเก็บข้อมูลลูกค้า
  Customer: a.model({
    firstName: a.string().required(),
    lastName: a.string(),
    phoneNumber: a.string().required(),
    address: a.string(),
    cars: a.hasMany('Car', 'ownerId'), // เชื่อมไปหาตารางรถ
  }).authorization((allow) => [allow.authenticated()]),

  // 2. ตารางเก็บข้อมูลรถยนต์
  Car: a.model({
    plateNumber: a.string().required(), // ทะเบียนรถ
    brand: a.string(),                 // ยี่ห้อ
    model: a.string(),                 // รุ่น
    color: a.string(),
    ownerId: a.id(),
    owner: a.belongsTo('Customer', 'ownerId'),
    serviceRecords: a.hasMany('ServiceRecord', 'carId'), // เชื่อมไปหาประวัติการซ่อม
  }).authorization((allow) => [allow.authenticated()]),

  // 3. ตารางประวัติการซ่อม/บริการ
  ServiceRecord: a.model({
    serviceDate: a.date().required(),
    description: a.string().required(), // รายละเอียดการซ่อม
    mileage: a.integer(),               // เลขไมล์
    totalPrice: a.float(),              // ราคาค่าซ่อม
    status: a.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']), // สถานะการซ่อม
    carId: a.id(),
    car: a.belongsTo('Car', 'carId'),
  }).authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // ใช้ Cognito (User Pool) ที่คุณเชื่อมไว้แล้ว
  },
});