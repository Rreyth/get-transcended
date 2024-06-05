DC := docker compose -f srcs/docker-compose.yml

all: auto_ip up

up:
	$(DC) up --build

down:
	$(DC) down

reload: down up

fclean: down pyclean
	@docker image rm $$(docker image ls -aq)  2>/dev/null || echo No image to delete
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || echo No volume to delete
	docker system prune -af --volumes
	rm -rf srcs/django_code/etc
	rm -rf srcs/django_code/transcend/profile

pyclean:
	bash -c "find . | grep -E "__pycache__" | xargs rm -rf"
	bash -c "find . | grep -E "\.pyc" | xargs rm -rf"

re: fclean up

auto_ip:
	@if [ "$(wildcard srcs/.env)" = "" ]; then \
		(echo "srcs/.env is needed"; false); \
	else \
		sed -i '/ADDRESS/d' srcs/.env; \
		echo "ADDRESS=$(shell hostname -i)" >> srcs/.env; \
	fi

.PHONY: all re clean fclean up down pyclean auto_ip
