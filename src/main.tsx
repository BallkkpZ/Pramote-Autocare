import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

/**
 * นำเข้าข้อมูลการตั้งค่าจาก Amplify
 * outputs: มาจาก Amplify Gen 2 (จัดการ Auth และ AppSync Data)
 * config: มาจาก Amplify Gen 1 (จัดการ REST API / orders)
 */
import outputs from '../amplify_outputs.json';
import config from './amplifyconfiguration.json';

// รวมการตั้งค่าเพื่อให้รองรับทั้ง Gen 1 และ Gen 2 อย่างสมบูรณ์
Amplify.configure({
  ...outputs,
  API: {
    ...outputs.data,
    REST: {
      // ลงทะเบียนชื่อ 'orderApi' ให้ตรงกับที่ไฟล์ Checkout.tsx เรียกใช้
      orderApi: {
        endpoint: "https://82el04rnoi.execute-api.ap-southeast-1.amazonaws.com/dev",
        region: "ap-southeast-1"
      },
      // ลงทะเบียนชื่อมาตรฐาน 'api' เผื่อไว้สำหรับการเรียกใช้ในอนาคต
      api: {
        endpoint: "https://82el04rnoi.execute-api.ap-southeast-1.amazonaws.com/dev",
        region: "ap-southeast-1"
      }
    }
  }
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  );
}