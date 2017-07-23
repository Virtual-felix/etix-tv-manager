FROM golang:1.8
LABEL maintainer "fabrega.felix@gmail.com"

WORKDIR /go/src/etix-tv-manager/api
RUN go get github.com/codegangsta/gin

## Keep this code for future production docker compose
#COPY ./ /go/src/etix-tv-manager/api
#RUN go install -race
#ENTRYPOINT /go/bin/api
