import requests

url = "https://portfolio-likith-jp4g.onrender.com/api/collab"
# Missing mandatory fields like 'full_name' and 'phone_number' to force failure
payload = {
    "country": "India",
    "collaboration_type": "Other",
    "purpose": "Testing Failure Flow"
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
