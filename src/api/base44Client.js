import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Override functions.invoke and integrations to use local backend server
const LOCAL_SERVER = import.meta.env.VITE_API_URL || 'http://localhost:3001';

base44.functions = {
  invoke: async (functionName, params = {}) => {
    const res = await fetch(`${LOCAL_SERVER}/functions/${functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Function call failed');
    return { data };
  },
};

base44.integrations = {
  Core: {
    InvokeLLM: async (params) => {
      const res = await fetch(`${LOCAL_SERVER}/integrations/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data.error || 'LLM call failed');
      return data;
    },
  },
};

// Prevent any auth redirects — we're running locally
base44.auth = {
  ...base44.auth,
  redirectToLogin: () => {},
  me: async () => ({ full_name: 'Local User', email: 'local@planora.app' }),
  logout: () => {},
  isAuthenticated: async () => true,
};
