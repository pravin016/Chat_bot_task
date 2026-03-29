# Frontend-Backend Connection Monitoring

## Overview

The app now includes comprehensive monitoring to verify frontend-backend connectivity and system health.

## Features

### 1. Connection Status Monitoring
- **File**: `src/services/monitoring.ts`
- Verifies frontend and backend are connected
- Checks if chat service is ready
- Monitors Gemini API and Supabase connectivity
- Measures request latency

### 2. Real-Time Status Display
- **Component**: `src/components/ConnectionStatusBanner.tsx`
- Green banner: ✓ Connected
- Red banner: ✗ Connection Failed
- Shows latency (e.g., "Connected (45ms)")
- Click to expand and see detailed status

### 3. API Request/Response Logging
- **File**: `src/api/client.ts`
- Logs all HTTP requests with:
  - Request method and URL
  - Request ID (for tracing)
  - Response time
  - Status code and error messages
- Console output format:
  ```
  [API] POST /chat (req-12345)
  [API] ✓ 200 POST /chat (234ms)
  ```

### 4. Connection Status Hook
- **File**: `src/hooks/useConnectionStatus.ts`
- React hook for checking connection status
- Periodic checks every 30 seconds
- Returns:
  - `status`: Full connection details
  - `isConnected`: Boolean (all systems OK)
  - `summary`: Human-readable status string
  - `latency`: Response time in ms
  - `errors`: Array of errors if any

## How to Use

### Check Connection Programmatically

```typescript
import { checkConnectionStatus, logConnectionDetails } from '../services/monitoring';

// One-time check
const status = await checkConnectionStatus();
console.log(status);

// Detailed report
await logConnectionDetails();

// Start periodic checks
const stop = startPeriodicHealthChecks(60000); // Every 60 seconds
// Later: stop();
```

### In React Components

```typescript
import { useConnectionStatus } from '../hooks/useConnectionStatus';

function MyComponent() {
  const { status, isConnected, summary, latency, errors } = useConnectionStatus(true);

  return (
    <View>
      {isConnected ? (
        <Text>✓ Connected ({latency}ms)</Text>
      ) : (
        <Text>✗ Connection Failed</Text>
      )}
      {errors.map((err) => (
        <Text key={err}>{err}</Text>
      ))}
    </View>
  );
}
```

### Connection Status Banner

```typescript
import ConnectionStatusBanner from '../components/ConnectionStatusBanner';

// Show in any screen
<ConnectionStatusBanner showDetails={false} />
// Click to expand and see full details
```

## What Gets Monitored

### Backend Health Check Endpoint
Calls: `GET /health`
Returns:
```json
{
  "status": "ok",
  "chat_ready": true,
  "gemini_configured": true,
  "supabase_connected": true
}
```

### Connection Status Object
```typescript
{
  frontendOk: boolean,           // Frontend is running
  backendOk: boolean,            // Backend responds
  chatReady: boolean,            // Chat endpoint is ready
  geminiConfigured: boolean,     // Gemini API key loaded
  supabaseConnected: boolean,    // Supabase verified
  lastChecked: number,           // Timestamp of last check
  latency: number,               // Request time in ms
  errors: string[]               // All error messages
}
```

## Backend Configuration

The backend already has:
- Sentry DSN configured in `.env`
- Health endpoint at `GET /health`
- Logging for all requests
- Error tracking

**To enable in backend**, ensure `.env` has:
```
SENTRY_DSN=https://your_sentry_dsn
```

## Frontend Sentry Integration (TODO)

Currently monitoring is done via:
1. Health check API calls
2. Request/response logging
3. Connection status display

To add Sentry to frontend:
```bash
npm install @sentry/react-native
```

Then in app initialization:
```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_FRONTEND_SENTRY_DSN",
  tracesSampleRate: 1.0,
});
```

## Console Output

When running the app, you'll see monitoring output:

```
[Monitoring] Backend health: {
  status: 'ok',
  chat_ready: true,
  gemini_configured: true,
  supabase_connected: true
}

[API] POST /chat (req-12345-abc)
[API] ✓ 200 POST /chat (234ms)

[Monitoring] Connection Status: {
  frontend: '✓',
  backend: '✓',
  chatReady: '✓',
  latency: '234ms',
  errors: 0
}
```

## Troubleshooting

### "Connection Failed" Banner
1. Check backend is running: `npm run backend`
2. Check API URL in `.env`: `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000`
3. Check network connectivity
4. View console errors for details

### High Latency (>1000ms)
1. Backend might be slow
2. Network might be congested
3. API endpoint might be processing slowly

### "Chat Not Ready" Status
1. Backend health endpoint failed
2. Gemini API not configured in backend `.env`
3. Supabase connection issue

## Integration Points

- **ChatScreen**: Shows connection status banner at top
- **useChat Hook**: Can check connection before sending
- **PaywallModal**: Can verify connection before payment
- **useRevenueCatInit**: Can verify backend connectivity

## Future Enhancements

- [ ] Sentry frontend SDK integration
- [ ] Error rate tracking
- [ ] Performance metrics dashboard
- [ ] Automatic error reporting
- [ ] Connection retry logic
- [ ] Offline mode detection
- [ ] Analytics integration
