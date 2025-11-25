import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import train_test_split
import joblib

SEED = 42
N_ROWS = 50_000

MODEL_PATH = Path(__file__).parent / 'model.pkl'
REPORT_PATH = Path(__file__).parent / 'training_report.md'


def generate_synthetic_dataset(n_rows: int = N_ROWS, seed: int = SEED) -> pd.DataFrame:
  rng = np.random.default_rng(seed)
  tenure_months = rng.integers(1, 36, size=n_rows)
  mrr = rng.normal(100, 40, size=n_rows).clip(10, 500)
  logins_7d = rng.integers(0, 30, size=n_rows)
  tickets_30d = rng.integers(0, 10, size=n_rows)
  nps = rng.integers(-100, 100, size=n_rows)

  # Simple churn generation rule
  logits = (
    -0.05 * tenure_months
    + 0.01 * tickets_30d
    - 0.02 * logins_7d
    - 0.01 * nps
    + rng.normal(0, 0.5, size=n_rows)
  )
  probs = 1 / (1 + np.exp(-logits))
  churn = (probs > 0.5).astype(int)

  return pd.DataFrame(
    {
      'tenure_months': tenure_months,
      'mrr': mrr,
      'logins_7d': logins_7d,
      'tickets_30d': tickets_30d,
      'nps': nps,
      'churn': churn,
    }
  )


def train_models(df: pd.DataFrame):
  X = df[['tenure_months', 'mrr', 'logins_7d', 'tickets_30d', 'nps']]
  y = df['churn']
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=SEED, stratify=y)

  rf = RandomForestClassifier(n_estimators=200, random_state=SEED)
  rf.fit(X_train, y_train)
  rf_probs = rf.predict_proba(X_test)[:, 1]
  rf_f1 = f1_score(y_test, rf_probs > 0.5)
  rf_auc = roc_auc_score(y_test, rf_probs)

  xgb = XGBClassifier(
    n_estimators=300,
    max_depth=4,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=SEED,
    eval_metric='logloss',
  )
  xgb.fit(X_train, y_train)
  xgb_probs = xgb.predict_proba(X_test)[:, 1]
  xgb_f1 = f1_score(y_test, xgb_probs > 0.5)
  xgb_auc = roc_auc_score(y_test, xgb_probs)

  scores = {
    'random_forest': {'f1': rf_f1, 'auc': rf_auc},
    'xgboost': {'f1': xgb_f1, 'auc': xgb_auc},
  }

  best_model, best_scores = (rf, scores['random_forest']) if rf_f1 >= xgb_f1 else (xgb, scores['xgboost'])
  return best_model, scores, {'f1': best_scores['f1'], 'auc': best_scores['auc']}


def write_report(scores: dict, best: dict):
  REPORT_PATH.write_text(
    f"# DROPIQ Training Report\n\n"
    f"RandomForest F1: {scores['random_forest']['f1']:.3f}, AUC: {scores['random_forest']['auc']:.3f}\n\n"
    f"XGBoost F1: {scores['xgboost']['f1']:.3f}, AUC: {scores['xgboost']['auc']:.3f}\n\n"
    f"**Selected model** F1: {best['f1']:.3f}, AUC: {best['auc']:.3f}\n"
  )


def main():
  df = generate_synthetic_dataset()
  model, scores, best_scores = train_models(df)
  joblib.dump(model, MODEL_PATH)
  write_report(scores, best_scores)


if __name__ == '__main__':
  main()
