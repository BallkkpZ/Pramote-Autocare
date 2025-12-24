import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

/**
 * ระหว่างการ Build บน Cloud ไฟล์นี้อาจจะยังไม่มี 
 * เราจึงต้องใช้ try-catch หรือตรวจสอบเงื่อนไขเพื่อไม่ให้ Build พัง
 */
import outputs from '../amplify_outputs.json';

// ตั้งค่า Amplify โดยใช้ค่าจาก outputs ทั้งหมด (รวมทั้ง Cognito และ Database)
Amplify.configure(outputs);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  );
}