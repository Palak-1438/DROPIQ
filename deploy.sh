#!/usr/bin/env bash
set -euo pipefail

# Simple deployment helper script. In a real setup, wire this to your
# CI/CD system (GitHub Actions) and container registry.

APP_VERSION=${APP_VERSION:-"latest"}
REGISTRY=${REGISTRY:-"ghcr.io/your-org"}

echo "Building Docker images for version: ${APP_VERSION}" 

# Build images
docker build -t "${REGISTRY}/dropiq-server:${APP_VERSION}" ../server
docker build -t "${REGISTRY}/dropiq-client:${APP_VERSION}" ../client
docker build -t "${REGISTRY}/dropiq-ml:${APP_VERSION}" ../ml-service

# Push images
docker push "${REGISTRY}/dropiq-server:${APP_VERSION}"
docker push "${REGISTRY}/dropiq-client:${APP_VERSION}"
docker push "${REGISTRY}/dropiq-ml:${APP_VERSION}"

echo "Images pushed. Wire into your hosting provider (Render/Railway/Vercel/Cloud Run)."
