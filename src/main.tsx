import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

/**
 * นำเข้า Config จากทั้ง 2 ส่วน เพื่อให้มั่นใจว่าทั้ง
 * ระบบสมาชิก (outputs) และ API (config) ทำงานได้ครบถ้วน
 */
import outputs from '../amplify_outputs.json';
import config from './amplifyconfiguration.json';

// รวมการตั้งค่าทั้งหมดเข้าด้วยกัน
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