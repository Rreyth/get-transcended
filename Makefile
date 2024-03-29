DC := docker compose -f srcs/docker-compose.yml

all: up

up:
	$(DC) up --build

down:
	$(DC) down

reload: down up

fclean: down pyclean
	@docker image rm $$(docker image ls -aq)  2>/dev/null || echo No image to delete
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || echo No volume to delete
	docker system prune -af --volumes

pyclean:
	bash -c "find . | grep -E "__pycache__" | xargs rm -rf"
	bash -c "find . | grep -E "\.pyc" | xargs rm -rf"

re: fclean up

.PHONY: all re clean fclean up down pyclean
