# --- Compilation --- 
FROM golang:1.26-bookworm AS builder
WORKDIR /app

# Copy dependency files
COPY go.mod go.sum ./
RUN go mod download

# Copiar source code
COPY . .

# Compile code
RUN CGO_ENABLED=1 GOOS=linux go build -o main cmd/server/main.go

# --- Execution --- 
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary and schema
COPY --from=builder /app/main .
COPY --from=builder /app/sql ./sql

# Create data directory
RUN mkdir ./data

EXPOSE 8080
CMD ["./main"]
