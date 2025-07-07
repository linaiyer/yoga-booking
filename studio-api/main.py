from fastapi import FastAPI
from scraper import scrape_yoga_studios_manhattan
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YELP_API_KEY = "_i3LTqNwhKJ8BgGKPSy1zFmNFyP6-E2CijX9HyYNtWfGv8CzCd2coZzEHu7wKlM6vFGpVT8Tjd3BRSyc6Raa0OlrlpLsuWiZOW7b8YBHuHnSNl8Y3TS1qrfmBchraHYx"
YELP_BUSINESS_URL = "https://api.yelp.com/v3/businesses/"

@app.get("/studios")
def get_studios():
    return scrape_yoga_studios_manhattan()

@app.get("/studio/{id}")
def get_studio_details(id: str):
    headers = {"Authorization": f"Bearer {YELP_API_KEY}"}
    url = YELP_BUSINESS_URL + id
    try:
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        return {"error": str(e)}

@app.get("/studio/{id}/reviews")
def get_studio_reviews(id: str):
    headers = {"Authorization": f"Bearer {YELP_API_KEY}"}
    url = f"https://api.yelp.com/v3/businesses/{id}/reviews"
    try:
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        return {"error": str(e)} 