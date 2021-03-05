from datetime import timedelta

DB_NAME = "rateyard"
DB_PASSWORD = "password"
DB_USER = "postgres"
DB_HOST = "docker-postgresql"

JWT_SECRET_KEY = "jwtsecretkey"

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"

CORS_EXPOSE_HEADERS = ['Access-Token', 'Refresh-Token']
JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)