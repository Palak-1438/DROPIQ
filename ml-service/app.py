from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path

app = FastAPI(title="DROPIQ ML Service")

MODEL_PATH = Path(__file__).parent / 'model.pkl'


class PredictRequest(BaseModel):
  features: list[float]


class PredictResponse(BaseModel):
  probability: float
  label: int
  shap_explanation: dict | None = None


def load_model():
  if MODEL_PATH.exists():
    return joblib.load(MODEL_PATH)
  # Fallback dummy model
  class Dummy:
    def predict_proba(self, X):
      return np.array([[0.3, 0.7]])
  return Dummy()


@app.get('/health')
async def health():
  return {"status": "ok", "service": "dropiq-ml"}


@app.post('/predict', response_model=PredictResponse)
async def predict(req: PredictRequest):
  model = load_model()
  X = np.array([req.features])
  proba = float(model.predict_proba(X)[0][1])
  label = int(proba >= 0.5)
  # SHAP explanation placeholder; real implementation in shap_explain.py
  shap_explanation = {"note": "SHAP explanation would be computed here."}
  return PredictResponse(probability=proba, label=label, shap_explanation=shap_explanation)
