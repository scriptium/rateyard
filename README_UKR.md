# rateyard

### Необхідне програмне забезпечення

Для функціонування журналу, на сервері має бути встановлено:

- Docker
- Docker Compose

### Конфігурація

Перед запуском слід у файлі `api/rateyard_api/config.py` змінити змінні:

- `EMAIL_NAME`, `EMAIL_PASSWORD`
- `JWT_SECRET_KEY`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`

### Запуск

Щоб запустити журнал, введіть наступну команду у сколнованій папці. Детальніше на [docs.docker.com](https://docs.docker.com/compose/).

```
docker-compose up
```