FROM alpine:3.18

RUN apk update && apk upgrade
RUN apk add --no-cache python3 py3-pip
COPY --chmod=777 utils/start.sh .

WORKDIR /app

COPY utils/requirements .
RUN pip install --no-cache-dir -r requirements
RUN rm requirements

CMD ["sh", "/start.sh"]
