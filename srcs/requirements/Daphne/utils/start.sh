sleep 1

python3 manage.py migrate
python3 manage.py shell < /game_relay.py &
python manage.py loaddata users/seed/AI_Account.json
daphne transcend.asgi:application -b 0.0.0.0 -p 8001
