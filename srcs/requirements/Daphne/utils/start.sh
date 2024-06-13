sleep 1

python3 manage.py migrate
python manage.py loaddata users/seed/AI_Account.json chat/seed/Main_Chat.json
daphne transcend.asgi:application -b 0.0.0.0 -p 8001
