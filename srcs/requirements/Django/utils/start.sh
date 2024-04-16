sleep 1

python transcend/manage.py migrate
python transcend/manage.py runserver 0.0.0.0:8000
