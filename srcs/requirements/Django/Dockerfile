FROM python:3.8

WORKDIR /app

# COPY utils/requirements /app/
COPY utils/requirements .
RUN pip install --no-cache-dir -r requirements
RUN rm requirements

# COPY . /app/
# RUN django-admin startproject transcend
# RUN cd transcend && python manage.py startapp myapp

CMD ["python", "transcend/manage.py", "runserver", "0.0.0.0:8000"]
