FROM nginx:latest

COPY conf/nginxTranscend.conf /etc/nginx/nginx.conf

RUN apt-get update -y && \
    apt-get install -y openssl && \
    openssl req -x509 -nodes -subj /C=FR -newkey rsa:2048 -keyout /etc/ssl/private/njegat-selfsigned.key -out /etc/ssl/certs/njegat-selfsigned.crt ;

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
