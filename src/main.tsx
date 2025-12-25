import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import outputs from '../amplify_outputs.json';

Amplify.configure({
  ...outputs,
  API: {
    REST: {
      orderApi: {
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