from __future__ import annotations

from typing import Any

import numpy as np
import shap


def compute_shap_explanation(model: Any, sample: list[float]) -> dict:
  X = np.array([sample])
  explainer = shap.TreeExplainer(model)
  shap_values = explainer.shap_values(X)
  # For binary models, shap_values is a list; take index 1
  values = shap_values[1][0].tolist() if isinstance(shap_values, list) else shap_values[0].tolist()
  return {"values": values}
