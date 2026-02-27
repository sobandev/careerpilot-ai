import urllib.request
import urllib.parse
import json

base_url = "http://localhost:8000"

def test_login_and_me():
    print("Testing Login -> /me cookie flow...")
    
    # 1. Login
    login_data = json.dumps({"email": "kingopisserious@gmail.com", "password": "password123"}).encode('utf-8')
    req = urllib.request.Request(f"{base_url}/api/auth/login", data=login_data, headers={'Content-Type': 'application/json'})
    cookies = []
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            print("Login Status:", response.status)
            for raw_h in response.headers.get_all('Set-Cookie') or []:
                cookies.append(raw_h.split(';')[0])
            print("Captured Cookies:", cookies)
    except Exception as e:
        print("Login failed:", e)
        return

    if not cookies:
        print("No cookies received!")
        return

    # 2. Get /me
    req_me = urllib.request.Request(f"{base_url}/api/auth/me")
    req_me.add_header('Cookie', '; '.join(cookies))
    
    try:
        with urllib.request.urlopen(req_me, timeout=5) as response:
            print("/me Status:", response.status)
            body = response.read().decode()
            print("/me Body:", body)
            assert "id" in json.loads(body)
            print("SUCCESS: /me recognized the user from the HttpOnly cookie.")
    except Exception as e:
        print("/me failed:", e)

if __name__ == "__main__":
    test_login_and_me()
