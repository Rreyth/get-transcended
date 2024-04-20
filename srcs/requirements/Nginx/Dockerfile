FROM alpine:3.18

RUN apk update && apk upgrade
RUN apk add nginx openssl

COPY conf/nginxTranscend.conf /etc/nginx/nginx.conf
COPY --chmod=777 conf/start.sh .

EXPOSE 8080

ENTRYPOINT [ "sh", "start.sh" ]