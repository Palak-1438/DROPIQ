# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Key commands

### Environment setup

- Create and activate a virtual environment (example for bash/PowerShell):
  - `python -m venv .venv`
  - On PowerShell: `.venv\\Scripts\\Activate.ps1`
  - On bash/zsh: `source .venv/bin/activate`
- Install dependencies:
  - `pip install -r requirements.txt`

### Run the ML service locally

- Start the FastAPI service with Uvicorn (matches the Dockerfile entrypoint):
  - `uvicorn app:app --host 0.0.0.0 --port 8000`
- Health check endpoint:
  - `GET /health` → basic service status JSON
- Prediction endpoint:
  - `POST /predict` with body like `{ "features": [1, 100, 5, 1, 10] }`

### Tests

- Run the full test suite:
  - `pytest`
- Run tests for this service module only:
  - `pytest tests`
- Run a single test:
  - `pytest tests/test_app.py::test_predict -vv`

### Training the model

- Train a fresh model and generate a report:
  - `python train.py`
- Artifacts:
  - `model.pkl` (saved in the repo root next to `app.py`) is the model that `app.load_model()` uses.
  - `training_report.md` summarizes RandomForest vs XGBoost performance and the selected model.

### Docker and deployment integration

- Build a local Docker image for the ML service from this directory:
  - `docker build -t dropiq-ml:local .`
- Run the container locally:
  - `docker run -p 8000:8000 dropiq-ml:local`
- In the parent repo, images for all three components (server, client, ML) are built/pushed via `deploy.sh`:
  - `APP_VERSION=0.1.0 REGISTRY=ghcr.io/your-org ./deploy.sh` (run from the monorepo root, see `deploy-instructions.md`).
- Platform deployment (from `deploy-instructions.md`):
  - ML service is intended to run on Render/Cloud Run from the `dropiq-ml:<version>` image, exposing port `8000`.
  - Environment variables for this service are derived from `ml-service/.env.example` (currently includes `ML_LOG_LEVEL`).

## Architecture overview

### Purpose and role in the wider system

- This directory implements the **DROPIQ ML service**, a small FastAPI application that exposes churn risk predictions over HTTP.
- It is consumed by the main backend (`server/src/routes/ml.ts` in the parent repo), which:
  - Calls `POST {ML_SERVICE_URL}/predict` with `{ customerId, features }`.
  - Persists the returned probability/label and SHAP explanation JSON to the database via Prisma.
  - Triggers high-risk notifications when the churn probability ≥ 0.7.
- Any change to the `/predict` response shape or semantics must stay compatible with `server/src/routes/ml.ts`.

### Runtime service (`app.py`)

- `FastAPI` application initialized as `app = FastAPI(title="DROPIQ ML Service")`.
- Endpoints:
  - `GET /health` → returns `{ "status": "ok", "service": "dropiq-ml" }`.
  - `POST /predict` → accepts `PredictRequest` with `features: list[float]` and returns `PredictResponse` with:
    - `probability: float` — probability of churn (class 1).
    - `label: int` — thresholded at 0.5 from `probability`.
    - `shap_explanation: dict | None` — currently a placeholder dict.
- Model loading:
  - `MODEL_PATH` is `Path(__file__).parent / 'model.pkl'`.
  - `load_model()` loads `model.pkl` via `joblib` if it exists; otherwise falls back to an in-memory `Dummy` model that returns a fixed probability (`0.7` for the positive class) for any input.
  - `/predict` converts the incoming feature list to a 2D NumPy array, calls `predict_proba`, and computes the label via `probability >= 0.5`.
- SHAP integration:
  - Currently, `/predict` returns a simple placeholder SHAP explanation.
  - The real SHAP logic lives in `shap_explain.py` and can be wired in when you are ready to pay the cost of SHAP at inference time.

### Offline training pipeline (`train.py`)

- Generates a **synthetic churn dataset** for experimentation using NumPy and pandas:
  - Features: `tenure_months`, `mrr`, `logins_7d`, `tickets_30d`, `nps`.
  - Target: `churn`, generated via a logistic function over the features with noise.
- Splits data into train/test (`train_test_split` with stratification) and trains **two models**:
  - `RandomForestClassifier` (scikit-learn) with 200 trees.
  - `XGBClassifier` (XGBoost) with typical binary-classification hyperparameters.
- Evaluation:
  - Computes F1 and ROC AUC on the test set for each model.
  - Chooses the best model by **F1 score** and returns both the full score dict and the best model’s metrics.
- Outputs:
  - Persists the **best model** to `model.pkl` via `joblib.dump`.
  - Writes a markdown `training_report.md` summarizing both models’ F1/AUC and highlighting the selected one.
- The runtime service (`app.py`) simply loads `model.pkl`; no retraining happens at request time.

### SHAP explanations (`shap_explain.py`)

- Provides `compute_shap_explanation(model, sample)` to compute per-feature SHAP values for tree-based models:
  - Wraps the sample list into a 2D NumPy array.
  - Uses `shap.TreeExplainer(model)` and `explainer.shap_values(X)`.
  - Normalizes the returned structure for binary models (where SHAP returns a list) to a dict: `{ "values": [...] }`.
- Intended usage:
  - Call this from `/predict` after obtaining the model and feature vector to replace the current placeholder.
  - Ensure that any new fields added to the SHAP payload remain JSON-serializable and stable for `server/src/routes/ml.ts`.

### Tests (`tests/test_app.py`)

- Uses `fastapi.testclient.TestClient` against the local FastAPI app:
  - `test_health` verifies `GET /health` returns 200 and `status == 'ok'`.
  - `test_predict` sends a sample feature vector to `/predict` and asserts that `probability` and `label` are present in the response.
- Tests run entirely in-process; the model may be the trained `model.pkl` if present or the `Dummy` model otherwise.

### Containerization (`Dockerfile`) and deploy flow

- `Dockerfile`:
  - Base image: `python:3.11-slim`.
  - Installs Python dependencies from `requirements.txt`.
  - Copies the entire `ml-service` context into `/app` and sets `WORKDIR /app`.
  - Exposes port `8000` and starts via:
    - `CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]`.
- Monorepo deployment scripts (from the parent directory):
  - `deploy.sh` builds/pushes three images: `dropiq-server`, `dropiq-client`, and `dropiq-ml`, tagging them with `APP_VERSION` and pushing to `REGISTRY`.
  - `deploy-instructions.md` documents how the `dropiq-ml` image is deployed to a managed container platform (Render/Cloud Run) and wired to the backend via `ML_SERVICE_URL`.

This `WARP.md` is scoped to the `ml-service` directory; consult `deploy-instructions.md` and the `server`/`client` directories in the monorepo root for broader system behavior and environment configuration.