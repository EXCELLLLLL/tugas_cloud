# ---- Build Stage ----
FROM golang:1.21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

# ---- Run Stage ----
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .

EXPOSE 8086

CMD ["./main"] 