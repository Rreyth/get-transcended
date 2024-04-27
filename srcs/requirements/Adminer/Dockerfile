FROM alpine:3.18

RUN apk update && apk upgrade && apk add wget php php-session php-mysqli

RUN mkdir adminer

WORKDIR /adminer

RUN wget http://www.adminer.org/latest.php -O index.php

ENTRYPOINT [ "php","-S","0.0.0.0:8080" ]