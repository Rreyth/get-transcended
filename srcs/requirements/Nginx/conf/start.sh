mkdir -p /app/etc/ssl/certs

# openssl req -x509 -nodes -subj /C=FR -newkey rsa:2048 -keyout /app/etc/ssl/certs/cert.key -out /app/etc/ssl/certs/cert.crt ;
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout app/etc/ssl/certs/cert.key -out /app/etc/ssl/certs/cert.crt -subj "/CN=localhost" -sha256

nginx -g "daemon off;"