from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_health():
  resp = client.get('/health')
  assert resp.status_code == 200
  assert resp.json()['status'] == 'ok'


def test_predict():
  resp = client.post('/predict', json={"features": [1, 100, 5, 1, 10]})
  assert resp.status_code == 200
  data = resp.json()
  assert 'probability' in data
  assert 'label' in data
