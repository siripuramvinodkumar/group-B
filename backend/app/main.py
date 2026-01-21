
from fastapi import FastAPI
from .routers import auth, users, shoutouts, comments, reactions, admin

app = FastAPI(title="BragBoard API")

# Inclusion of routers as requested
# app.include_router(auth.router)
# app.include_router(users.router)
# app.include_router(shoutouts.router)
# app.include_router(comments.router)
# app.include_router(reactions.router)
# app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to BragBoard API"}
