FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY main .

EXPOSE 8080
CMD ["./main"]
