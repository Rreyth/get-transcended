FROM nginx:latest

COPY conf/nginxTranscend.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/ssl/certs

RUN apt-get update -y && \
    apt-get install -y openssl && \
    openssl req -x509 -nodes -subj /C=FR -newkey rsa:2048 -keyout /etc/ssl/certs/cert.key -out /etc/ssl/certs/cert.crt ;

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
