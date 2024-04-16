FROM python:3.8

COPY --chmod=777 utils/start.sh .

WORKDIR /app

# COPY utils/requirements /app/
COPY utils/requirements .
COPY utils/game_relay.py /game_relay.py
RUN pip install --no-cache-dir -r requirements
RUN pip install --no-cache-dir websockets
RUN rm requirements

# COPY . /app/
# RUN django-admin startproject transcend
# RUN cd transcend && python manage.py startapp myapp

CMD ["sh", "/start.sh"]
