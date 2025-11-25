# DROPIQ – Churn Management SaaS Platform

DROPIQ is a production-oriented churn management SaaS starter kit. It includes:

- **Client**: Next.js 14 (App Router) + React + TailwindCSS + ShadCN-style components
- **Server**: Node.js + Express + TypeScript + Prisma (MySQL)
- **ML Service**: FastAPI + scikit-learn + XGBoost + SHAP
- **Infra**: Docker, Docker Compose, GitHub Actions, Prometheus + Grafana hooks
- **Docs**: GTM, pitch deck, investor pack, security & ops checklists

## Monorepo structure

- `client/` – Next.js 14 frontend (dashboard, auth, customers, churn insights)
- `server/` – Express + TypeScript API, Prisma schema, auth, churn & alerts
- `ml-service/` – FastAPI churn model service, training pipeline, SHAP
- `infra/` – `docker-compose.yml`, Prometheus/Grafana, MySQL backup helpers
- `docs/` – Product, GTM, security, and investor documentation

## Quick start (local dev with Docker Compose)

Requirements:

- Docker + Docker Compose
- Git

```bash
# From repo root
cd infra
docker-compose up --build
```

Services:

- Client: http://localhost:3000
- API: http://localhost:4000
- ML service: http://localhost:8000
- MySQL: localhost:3306

Initial migrations and seed can be added later via Prisma (see `server/prisma`).

## Quick start (local dev without Docker)

```bash
# 1) Backend
cd server
cp .env.example .env
npm install
npm run prisma:generate || npx prisma generate
npm run dev

# 2) ML service
cd ../ml-service
cp .env.example .env
python -m venv .venv
. .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
python train.py  # optional: trains model.pkl
uvicorn app:app --reload --port 8000

# 3) Frontend
cd ../client
cp .env.example .env.local
npm install
npm run dev
```

## Architecture (high level)

```text
[Next.js client]  --REST/WS-->  [Express API]  --SQL--> [MySQL]
        |                           |
        |                           +----HTTP----> [FastAPI ML service]
        |                                            (scikit-learn/XGBoost + SHAP)
        |
        +-------------------> [S3 / Email provider]

[Prometheus] <--- metrics --- [API, ML]
[Grafana]    <--- visualize --/
[Sentry]     <--- errors -----/
```

See `docs/ARCHITECTURE.md` for more detail.

## API overview

- `POST /api/auth/signup` – Create account, send verification email (stub)
- `POST /api/auth/login` – JWT login (access + refresh tokens)
- `GET /api/customers` – List/search/paginate/filter customers
- `POST /api/customers` – Create customer
- `POST /api/ml/predict` – Proxy to ML service `/predict`, persist churn score

Full OpenAPI specs are in `docs/API_NODE_OPENAPI.yaml` and `docs/API_ML_OPENAPI.yaml`.

## Env & secrets

All secrets are supplied via environment variables. Examples:

- `server/.env.example`
- `client/.env.example`
- `ml-service/.env.example`

For production, use a secret manager (e.g. Doppler, 1Password, AWS Secrets Manager) and do **not** commit `.env` files.

## Deployment

- **Client**: Vercel
- **Server**: Railway / Render (Docker image)
- **ML service**: Render / Cloud Run (Docker image)
- **DB**: Managed MySQL (PlanetScale, RDS, etc.)

See `deploy-instructions.md` for concrete deployment steps and `docs/LAUNCH_CHECKLIST.md` for a pre-launch checklist.
