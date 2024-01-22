FROM python:3.8

WORKDIR /app/transcend

COPY utils/requirements .
RUN pip install --no-cache-dir -r requirements
RUN rm requirements


# Copiez le code source dans le conteneur
# COPY . .

# Exposez le port que Daphne utilisera (par exemple, 8001)
EXPOSE 8001

# Commande pour démarrer Daphne
CMD ["daphne", "transcend.asgi:application", "-b", "0.0.0.0", "-p", "8001"]
