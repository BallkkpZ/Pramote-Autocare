import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

/**
 * นำเข้าข้อมูลการตั้งค่าจาก Amplify
 * outputs: สำหรับระบบสมาชิก (Cognito) และ Data (Gen 2)
 * config: สำหรับระบบ API (REST) ที่เราเพิ่งสร้างเพิ่ม
 */
import outputs from '../amplify_outputs.json';
import config from './amplifyconfiguration.json';

// รวมการตั้งค่าทั้งหมดเข้าด้วยกันเพื่อให้แอปเรียกใช้งานได้ทุกส่วน
Amplify.configure({
  ...outputs,
  ...config
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