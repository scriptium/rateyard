from datetime import timedelta

DB_NAME = "rateyard"
DB_PASSWORD = "password"
DB_USER = "postgres"
DB_HOST = "docker-postgresql"

JWT_SECRET_KEY = "jwtsecretkey"

EMAIL_VALIDATION_API_KEY = "39fd626c-3f59-46ce-8860-7b7a95dca932"

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"

CORS_EXPOSE_HEADERS = ['Access-Token', 'Refresh-Token']
MARKS_VALUES = tuple(range(1, 13))
JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

EMAIL_NAME = 'rateyard@gmail.com'
EMAIL_PASSWORD = ''
SMTP_HOST = 'smtp.gmail.com'
SMTP_PORT = 587