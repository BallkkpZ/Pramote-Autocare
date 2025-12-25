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

// การ Merge Config: 
// เราใช้ Auth จาก Gen 2 (outputs) เป็นหลัก 
// และนำ REST API จาก Gen 1 (config) มาฉีดเข้าไปในระบบ
Amplify.configure({
  ...outputs,
  API: {
    ...outputs.data, // รักษาค่า AppSync เดิม (ถ้ามี)
    REST: {
      ...(config.aws_cloud_logic_custom || []).reduce((acc, api) => ({
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