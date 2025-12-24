import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_8jjSk7kY9',
      userPoolClientId: '3r9v3t1t71p2vrbokia31856b8',
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
  root.render(<App />);
}