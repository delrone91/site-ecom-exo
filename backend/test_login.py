"""
Script de test pour vérifier l'endpoint de login
"""
import requests
import json

# Test 1: Avec email et password en JSON
print("=== Test 1: Login avec JSON ===")
url = "http://localhost:8000/api/auth/login"
data = {
    "email": "admin@ecom.test",
    "password": "admin123"
}

print(f"URL: {url}")
print(f"Data: {json.dumps(data, indent=2)}")

response = requests.post(url, json=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 200:
    print("✅ Login réussi!")
else:
    print("❌ Login échoué")
    print(f"Détails: {response.json() if response.text else 'Pas de détails'}")
