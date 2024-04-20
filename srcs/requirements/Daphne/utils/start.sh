sleep 1

python3 manage.py migrate
python3 manage.py shell < /game_relay.py &
daphne transcend.asgi:application -b 0.0.0.0 -p 8001
