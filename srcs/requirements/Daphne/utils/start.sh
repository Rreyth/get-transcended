sleep 1

python3 manage.py migrate
python manage.py loaddata users/seed/AI_Account.json chat/seed/Main_Chat.json
python manage.py runserver 0.0.0.0:8001
