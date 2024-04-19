sleep 1

mkdir -p /certs
cat /app/etc/ssl/certs/cert.key > /certs/cert.pem
cat /app/etc/ssl/certs/cert.crt >> /certs/cert.pem

python3 GameHubServer.py