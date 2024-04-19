sleep 1

python manage.py migrate
daphne transcend.asgi:application -b 0.0.0.0 -p 8001