FROM alpine:3.18

COPY --chmod=777 server server
RUN apk add --no-cache python3 py3-pip
RUN pip install --no-cache-dir websockets
WORKDIR /server

ENTRYPOINT [ "sh", "start.sh" ]