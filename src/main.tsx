import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 1. เพิ่มบรรทัดนี้: นำเข้าเครื่องมือของ AWS
import { Amplify } from 'aws-amplify';

// 2. เพิ่มบรรทัดนี้: ตั้งค่าให้รู้จักกับ Cognito User Pool ของคุณ
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_8jJsk7kY9',  // รหัสบัตรประชาชนระบบ (User Pool ID)
      userPoolClientId: '3r9v3t1t71p2vrbokia31856b8', // รหัสแอป (Client ID)
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true
    }
  }
});

createRoot(document.getElementById("root")!).render(<App />);