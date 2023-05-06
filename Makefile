up:
	@docker compose up

down:
	@docker compose down

build:
	@docker compose up --build

log.bot:
	@docker compose logs bot

shell.bot:
	@docker compose exec bot bash