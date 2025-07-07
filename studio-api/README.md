# Studio API

A FastAPI backend for scraping and serving yoga studios in Manhattan (NYC).

## Setup

1. Create a virtual environment (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the API

```bash
uvicorn main:app --reload
```

- The API will be available at http://localhost:8000
- The endpoint `/studios` will return a list of yoga studios in Manhattan (scraped live from Yelp). 