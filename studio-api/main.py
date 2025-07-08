from fastapi import FastAPI
from scraper import scrape_yoga_studios_manhattan
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup

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

@app.get("/studio/{id}/website-info")
def get_studio_website_info(id: str):
    headers = {"Authorization": f"Bearer {YELP_API_KEY}"}
    # Get the studio's website from Yelp details
    yelp_url = YELP_BUSINESS_URL + id
    try:
        yelp_resp = requests.get(yelp_url, headers=headers)
        yelp_resp.raise_for_status()
        yelp_data = yelp_resp.json()
        # Only use the website if present in the Yelp API response
        biz_website = yelp_data.get("website")
        if not biz_website:
            return {"error": "No business website available from Yelp API."}
        # Fetch the business's own website for meta info
        resp = requests.get(biz_website, timeout=8)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else None
        meta_desc = None
        meta = soup.find("meta", attrs={"name": "description"})
        if meta and hasattr(meta, 'get'):
            meta_content = meta.get("content")
            if meta_content and isinstance(meta_content, str):
                meta_desc = meta_content.strip()
        first_p = soup.find("p")
        first_h1 = soup.find("h1")
        summary = first_p.get_text(strip=True) if first_p else (first_h1.get_text(strip=True) if first_h1 else None)
        return {
            "title": title,
            "meta_description": meta_desc,
            "summary": summary,
            "website": biz_website
        }
    except Exception as e:
        return {"error": str(e)} 