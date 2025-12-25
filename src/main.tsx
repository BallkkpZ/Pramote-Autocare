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

// รวมการตั้งค่าทั้งหมดเข้าด้วยกัน
// เราใช้การกระจายค่า (Spread) และระบุโครงสร้าง API REST ให้ชัดเจนตามมาตรฐาน Amplify Library
Amplify.configure({
  ...outputs,
  API: {
    REST: {
      ...config.aws_cloud_logic_custom.reduce((acc, api) => ({
        ...acc,
        [api.name]: {
          endpoint: api.endpoint,
          region: api.region
        }
      }), {})
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