import requests

url = "http://localhost:3001/api/notes"

body = {
    "content": "This is a note created using the requests library in Python.",
    "important": True
}

response = requests.post(url, json=body)
print(response.headers)