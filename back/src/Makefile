.PHONY: generate build

generate:
	sqlc generate

build: generate
	CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o main cmd/server/main.go
