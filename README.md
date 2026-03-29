# ChatBot Assignment App

This repo now contains:
- Expo React Native frontend (`app/`, `src/`)
- FastAPI backend with Gemini integration (`backend/`)
- Supabase auth/database wiring
- RevenueCat paywall flow (weekly/yearly)
- Sentry backend monitoring support
- Ngrok tunnel setup

## 1) Frontend setup (Expo)

```bash
npm install
```

Create `.env` from `.env.example` and fill:
- `EXPO_PUBLIC_API_BASE_URL` (your ngrok HTTPS URL)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`

Start app:

```bash
npx expo start --port 8082
```

## 2) Backend setup (FastAPI + Gemini + Sentry + Supabase)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example` and fill:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `SENTRY_DSN`

Run backend:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 3) Supabase DB schema

Run SQL from `supabase/schema.sql` in Supabase SQL editor.

## 4) Ngrok tunnel

In another terminal:

```bash
cd backend
ngrok http 8000
```

Copy the HTTPS forwarding URL into frontend `.env` as:
- `EXPO_PUBLIC_API_BASE_URL=https://<your-ngrok-id>.ngrok-free.app`

## 5) RevenueCat products

Create two products in RevenueCat:
- Weekly subscription (`WEEKLY`)
- Annual subscription (`ANNUAL`)

Create an offering and attach both packages.  
The Profile tab automatically loads available packages after sign-in and enables purchase buttons.

## 6) Test flow

1. Sign up / sign in from `Profile` tab.
2. Purchase weekly/yearly from paywall section.
3. Go to `Chat` tab and send a prompt.
4. Verify backend logs in Sentry and messages in Supabase `chat_messages`.

## Submission checklist

- Screen recording of:
  - Running app (auth + paywall + chat)
  - RevenueCat dashboard products/offering
  - Sentry issue/performance event from backend
- GitHub repo with both frontend and backend
