FROM nginx:latest

COPY conf/nginxTranscend.conf /etc/nginx/nginx.conf
COPY --chmod=777 conf/start.sh .

RUN apt-get update -y && \
    apt-get install -y openssl
    # openssl req -x509 -nodes -subj /C=FR -newkey rsa:2048 -keyout /etc/ssl/private/njegat-selfsigned.key -out /etc/ssl/certs/njegat-selfsigned.crt ;

EXPOSE 8080

ENTRYPOINT [ "sh", "start.sh" ]


# CMD ["nginx", "-g", "daemon off;"]
