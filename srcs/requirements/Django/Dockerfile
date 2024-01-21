FROM python:3.8

WORKDIR /app

# COPY utils/requirements /app/
COPY utils/requirements .
RUN pip install --no-cache-dir -r requirements

# COPY . /app/
# RUN django-admin startproject project
# RUN cd project && python manage.py startapp monapp

CMD ["python", "project/manage.py", "runserver", "0.0.0.0:8000"]