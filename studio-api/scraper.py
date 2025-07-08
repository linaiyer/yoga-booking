import requests
import os

YELP_API_KEY = "_i3LTqNwhKJ8BgGKPSy1zFmNFyP6-E2CijX9HyYNtWfGv8CzCd2coZzEHu7wKlM6vFGpVT8Tjd3BRSyc6Raa0OlrlpLsuWiZOW7b8YBHuHnSNl8Y3TS1qrfmBchraHYx"
YELP_API_URL = "https://api.yelp.com/v3/businesses/search"

def scrape_yoga_studios_manhattan():
    headers = {
        "Authorization": f"Bearer {YELP_API_KEY}"
    }
    params = {
        "term": "yoga studio",
        "location": "Manhattan, NY",
        "limit": 20
    }
    resp = requests.get(YELP_API_URL, headers=headers, params=params)
    data = resp.json()
    studios = []
    for biz in data.get("businesses", []):
        studios.append({
            "id": biz.get("id"),
            "name": biz.get("name"),
            "address": ", ".join(biz["location"].get("display_address", [])),
            "latitude": biz["coordinates"].get("latitude"),
            "longitude": biz["coordinates"].get("longitude"),
            "rating": biz.get("rating"),
            "phone": biz.get("display_phone"),
            "url": biz.get("url"),
            "image_url": biz.get("image_url"),
            "categories": [cat["title"] for cat in biz.get("categories", [])],
            "price": biz.get("price"),
        })
    return studios 