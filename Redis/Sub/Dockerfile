FROM golang

WORKDIR /app

RUN go mod init github.com/andreaflores/Suficiencia_SO1
RUN go get github.com/golang/protobuf/proto
RUN go get github.com/gorilla/mux
RUN go get github.com/go-redis/redis/v8
RUN go get golang.org/x/net/http2
RUN go get golang.org/x/sys/unix
RUN go get google.golang.org/genproto/googleapis/rpc/status
RUN go get google.golang.org/protobuf/cmd/protoc-gen-go
RUN go get go.mongodb.org/mongo-driver/mongo

COPY . .


CMD ["go", "run", "sub.go"]
