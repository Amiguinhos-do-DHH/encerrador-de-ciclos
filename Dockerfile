FROM oven/bun:0.5
WORKDIR /encerrador-de-ciclos

COPY . .
RUN bun install

CMD ["bun", "src/index.ts"]
