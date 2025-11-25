# DROPIQ Deployment Instructions

This document outlines a pragmatic deployment path using Vercel (client), Railway/Render (API), and Render/Cloud Run (ML service).

## 1. Build & push images

Use `deploy.sh` from CI or locally (requires Docker and registry auth):

```bash
APP_VERSION=0.1.0 REGISTRY=ghcr.io/your-org ./deploy.sh
```

You will get three images:

- `dropiq-server:<version>`
- `dropiq-client:<version>`
- `dropiq-ml:<version>`

## 2. Provision managed MySQL

- Choose PlanetScale, RDS, or Railway MySQL
- Create database `dropiq`
- Note connection URL (e.g. `mysql://user:pass@host:3306/dropiq`)
- Configure automated backups and retention (see `docs/GDPR_DATA_RETENTION.md`)

## 3. Deploy backend (Railway/Render)

- Create a new service from the `dropiq-server` image
- Set env vars based on `server/.env.example`:
  - `DATABASE_URL`
  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
  - `ML_SERVICE_URL` (e.g. `https://your-ml-service`)
  - `SMTP_*` or Postmark/SendGrid keys
- Run migrations: `npx prisma migrate deploy`

## 4. Deploy ML service (Render/Cloud Run)

- Create service from `dropiq-ml` image
- Expose port `8000`
- Set env vars from `ml-service/.env.example`
- (Optional) Run `python train.py` as a one-off job to train a fresh model

## 5. Deploy client (Vercel)

- Import GitHub repo into Vercel
- Set `ROOT` directory to `client`
- Set env vars from `client/.env.example`:
  - `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://api.yourdomain.com`)
- Configure production domain

## 6. Observability

- Wire API & ML logs and metrics to:
  - **Prometheus/Grafana** (see `infra/prometheus.yml` and `docs/KPIS.md`)
  - **Sentry** DSN for client & server

## 7. Hardening checklist

Before go-live, review:

- `docs/SECURITY_CHECKLIST.md`
- `docs/GDPR_DATA_RETENTION.md`
- `docs/LAUNCH_CHECKLIST.md`
