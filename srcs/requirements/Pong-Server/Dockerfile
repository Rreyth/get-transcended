FROM alpine:3.18

COPY --chmod=777 server server
RUN apk add --no-cache python3 py3-pip openssl
RUN pip install websockets
WORKDIR /server

RUN mkdir -p /certs
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /certs/cert.key -out /certs/cert.crt -subj "/CN=localhost" -sha256
RUN cat /certs/cert.key /certs/cert.crt > /certs/cert.pem

CMD ["python3", "GameHubServer.py"]
