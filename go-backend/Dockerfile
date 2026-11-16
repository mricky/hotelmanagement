# Multi-stage Docker build for Go Backend Engine
FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates tzdata
ENV TZ=Asia/Jakarta
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.. /Users/hacaca/Projects/personal/hotelmanagement
EXPOSE 8000
CMD ["./main"]
