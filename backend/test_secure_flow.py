import requests
import json
import secrets
import time

API_BASE = "https://portfolio-likith-jp4g.onrender.com"
# API_BASE = "http://localhost:8000" # Use local for testing if needed

def test_secure_collab_flow():
    print("--- Starting Secure Collaboration Flow Test ---")
    
    # 1. Simulate Form Submission
    payload = {
        "full_name": "TEST SECURE BOT",
        "phone_number": "+910000000000",
        "country": "India",
        "collaboration_type": "Partnership",
        "purpose": "Testing secure verification system token generation.",
        "source": "test_script"
    }
    
    print(f"Step 1: Submitting form to {API_BASE}/api/collab...")
    try:
        response = requests.post(f"{API_BASE}/api/collab", json=payload)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"FAILED Step 1: {e}")
        return

    if data.get("success") and data.get("id") and data.get("token"):
        print(f"PASS: Backend returned ID: {data['id']} and Token: {data['token']}")
        inserted_id = data['id']
        secure_token = data['token']
    else:
        print(f"FAIL: Backend response missing required fields: {data}")
        return

    # 2. Test Verification with REAL ID and TOKEN
    print(f"\nStep 2: Testing Verification with REAL ID and TOKEN...")
    verify_url = f"{API_BASE}/api/collab/verify?id={inserted_id}&token={secure_token}"
    v_resp = requests.get(verify_url)
    v_data = v_resp.json()
    
    if v_data.get("verified") == True:
        print(f"PASS: Real Token Verified! Message: {v_data.get('message')}")
    else:
        print(f"FAIL: Verification failed for valid token: {v_data}")

    # 3. Test Verification with WRONG TOKEN
    print(f"\nStep 3: Testing Verification with WRONG TOKEN...")
    verify_url_fake = f"{API_BASE}/api/collab/verify?id={inserted_id}&token=fake_token_123"
    v_resp_fake = requests.get(verify_url_fake)
    v_data_fake = v_resp_fake.json()
    
    if v_data_fake.get("verified") == False and v_data_fake.get("reason") == "not_found":
        print(f"PASS: Wrong token blocked correctly. Reason: {v_data_fake.get('reason')}")
    else:
        print(f"FAIL: Wrong token was NOT blocked correctly or returned wrong reason: {v_data_fake}")

    # 4. Test Verification with MISSING TOKEN (simulated by empty string or omission)
    print(f"\nStep 4: Testing Verification with MISSING ID...")
    verify_url_missing = f"{API_BASE}/api/collab/verify?token={secure_token}"
    # Requests usually handles params, let's just test manually for missing id param handled by FastAPI validation
    v_resp_missing = requests.get(verify_url_missing)
    if v_resp_missing.status_code == 422: # FastAPI validation error for missing required param
        print("PASS: Missing ID blocked by FastAPI validation (422).")
    else:
         print(f"INFO: Missing ID returned {v_resp_missing.status_code}. Response: {v_resp_missing.text}")

    # 5. Test Non-Existing ID
    print(f"\nStep 5: Testing Non-Existing ID...")
    verify_url_none = f"{API_BASE}/api/collab/verify?id=999999&token={secure_token}"
    v_resp_none = requests.get(verify_url_none)
    v_data_none = v_resp_none.json()
    if v_data_none.get("verified") == False:
        print(f"PASS: Non-existing ID rejected correctly.")
    else:
        print(f"FAIL: Non-existing ID accepted? {v_data_none}")

    print("\n--- Secure Collaboration Flow Test Complete ---")

if __name__ == "__main__":
    test_secure_collab_flow()
