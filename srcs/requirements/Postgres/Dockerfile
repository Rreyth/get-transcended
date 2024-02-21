FROM postgres:latest

ENV POSTGRES_PASSWORD mysecretpassword
ENV POSTGRES_DB mydatabase

COPY ./SQL-scripts/ /docker-entrypoint-initdb.d/
