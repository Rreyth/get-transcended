mkdir -p /app/etc/ssl/certs

openssl req -x509 -nodes -subj /C=FR -newkey rsa:2048 -keyout /app/etc/ssl/certs/cert.key -out /app/etc/ssl/certs/cert.crt ;

nginx -g "daemon off;"