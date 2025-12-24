import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// นำเข้าข้อมูลจาก Sandbox เพื่อใช้ Database
import outputs from '../amplify_outputs.json';

Amplify.configure({
  ...outputs, // เพิ่มส่วนนี้เพื่อให้ใช้ Database ได้
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_8jJsk7kY9',
      userPoolClientId: '3r9v3tlt71p2vrbokia31856b8',
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

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  );
}