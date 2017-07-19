FROM golang:1.8
LABEL maintainer "fabrega.felix@gmail.com"

WORKDIR /go/src/etix-tv-manager/api
COPY . /go/src/etix-tv-manager/api
#RUN go get -u github.com/labstack/echo/...
RUN go install -race
ENTRYPOINT /go/bin/api
