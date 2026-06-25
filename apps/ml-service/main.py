from fastapi import FastAPI

app = FastAPI(title="DropIQ ML Service")

@app.get("/")
def read_root():
    return {"status": "ok"}
