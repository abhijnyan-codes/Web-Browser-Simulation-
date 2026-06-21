FROM ubuntu:24.04

RUN apt-get update && \
    apt-get install -y g++

WORKDIR /app

COPY Backend/ .

RUN g++ server.cpp -o server -std=c++17 -pthread

EXPOSE 8080

CMD ["./server"]