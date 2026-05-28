import requests

url = "https://portfolio-likith-jp4g.onrender.com/api/admin/collabs"
headers = {
    "x-admin-token": "Mahitha"
}

try:
    response = requests.get(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
