from fastapi import FastAPI
from scraper import scrape_yoga_studios_manhattan
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/studios")
def get_studios():
    return scrape_yoga_studios_manhattan() 