import requests
import json
import time

def test_lead_pipeline():
    url = "http://localhost:3001/api/leads/"
    payload = {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "company": "Innovation Labs",
        "role": "Product Manager",
        "message": "We are interested in your AI lead automation system. We have a high volume of leads and need a way to score them automatically."
    }
    
    print(f"Sending test lead to {url}...")
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Wait a moment for server to be ready
    time.sleep(2)
    test_lead_pipeline()
