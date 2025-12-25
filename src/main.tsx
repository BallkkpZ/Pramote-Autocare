import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import outputs from '../amplify_outputs.json';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: outputs.auth.user_pool_id,
      userPoolClientId: outputs.auth.user_pool_client_id,
      identityPoolId: outputs.auth.identity_pool_id,
      allowGuestAccess: outputs.auth.unauthenticated_identities_enabled,
    }
  },
  API: {
    GraphQL: {
      endpoint: outputs.data.url,
      region: outputs.data.aws_region,
      defaultAuthMode: 'userPool' as const,
    },
    REST: {
      orderApi: {
        endpoint: "https://82el04rnoi.execute-api.ap-southeast-1.amazonaws.com/dev",
        region: "ap-southeast-1",
        paths: ['/orders', '/orders/*', '/track-order']
      }
    }
  }
};

Amplify.configure(amplifyConfig);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  );
}
