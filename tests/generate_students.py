import requests
import randominfo
import string
import random

letters = string.ascii_lowercase

username = 'admin'
password = 'admin'

response = requests.post(
    'http://localhost:8000/auth/login_admin',
    json={'username': username, 'password': password})
access_token = response.headers['Access-Token']
count = int(input('Count: '))
class_id = int(input('Class id: '))
students = []
for i in range(count):
    full_name = randominfo.get_full_name()
    students.append(
        {
            'full_name': full_name,
            'username': full_name.split()[0].lower(),
            'email': ''.join(random.choice(letters) for i in range(5)) + '@gmail.com',
            'password': '1',
            'class_id': class_id
        }
    )

response = requests.post(
    'http://localhost:8000/admin/create_students',
    json=students,
    headers={'Authorization': 'Bearer ' + access_token}
)
print(response.text)
