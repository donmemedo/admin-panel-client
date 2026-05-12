# Admin Panel Modernized

This package is a cleaned and modernized version of the uploaded admin panel.

## What changed

- Frontend upgraded to Next.js 16, React 19, TypeScript 6, ESLint flat config, and a modern Node 24 LTS Docker image.
- Company-specific endpoints, private registry references, GitLab deployment hooks, private GitLab curl token usage, and .NET CI jobs were removed.
- Runtime configuration now comes from `NEXT_PUBLIC_*` environment variables or the generated `public/static/assets/js/env-config.js` file.
- A Python FastAPI backend gateway was added under `backend/` to replace company-specific service coupling with configurable proxy targets.
- Local font binaries were removed from the distributable. The UI now uses a system font stack.

## Local development

Install frontend dependencies:

```bash
npm install
```

Run the FastAPI backend:

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Run the Next.js frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Configure upstream services

The FastAPI proxy exposes these service aliases:

- `/proxy/admin/*` -> `ADMIN_SERVICE_URL`
- `/proxy/online-trading/*` -> `ONLINE_TRADING_SERVICE_URL`
- `/proxy/netflow/*` -> `NETFLOW_SERVICE_URL`
- `/proxy/files/*` -> `FILE_SERVICE_URL`
- `/proxy/marketer/*` -> `MARKETER_SERVICE_URL`
- `/proxy/sejam/*` -> `SEJAM_SERVICE_URL`

Set the environment variables in `backend/.env` using `backend/.env.example` as a template.

## Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`  
Backend health: `http://localhost:8000/health`

## Notes

The uploaded project contained only a Next.js client. There was no C# application source code to translate. The C#/.NET coupling present in the upload was CI/deployment infrastructure, so it has been replaced with the FastAPI gateway and Python-oriented backend setup.
