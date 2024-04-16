sleep 1

python transcend/manage.py migrate
python3 transcend/manage.py shell < /game_relay.py &
python transcend/manage.py runserver 0.0.0.0:8000
