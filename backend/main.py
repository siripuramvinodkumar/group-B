
from fastapi import FastAPI, Depends, HTTPException
from typing import List
# from app.routers import auth, users, shoutouts, comments, reactions, admin
# from app.database import engine, Base

app = FastAPI(title="BragBoard API")

@app.get("/")
def read_root():
    return {"message": "Welcome to BragBoard API"}

# Example routes structure as requested
@app.post("/auth/login")
async def login():
    pass

@app.get("/shoutouts/", response_model=List[dict])
async def get_shoutouts():
    pass

@app.post("/shoutouts/")
async def create_shoutout():
    pass

@app.delete("/admin/shoutouts/{id}")
async def delete_shoutout(id: int):
    pass
