FROM alpine:3.18

RUN apk update && apk upgrade
RUN apk add --no-cache python3 py3-pip
WORKDIR /app/transcend

COPY utils/requirements .
RUN pip install --no-cache-dir -r requirements
RUN rm requirements

EXPOSE 8001

CMD ["daphne", "transcend.asgi:application", "-b", "0.0.0.0", "-p", "8001"]