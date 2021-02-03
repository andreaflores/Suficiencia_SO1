package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

type casoJSON struct {
	Name          string `json: "name"`
	Location      string `json: "location"`
	Age           int    `json: "age"`
	Infected_Type string `json: "infected_type"`
	State         string `json: "state"`
}

var ctx = context.Background()

const (
	port = ":50051"
)

type server struct {
	pb.UnimplementedGreeterServer
}

func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("Received: %v", in.GetName())

	//Conexion a Redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     "35.223.38.239:6379",
		Password: "sufi",
		DB:       0, // default DB
	})

	key := "listacasos"
	rdb.LPush(ctx, key, in.GetName())	//lo insertamos en redis como un string del json en una lista

	//Conexion Mongo
	//Deserializar json recivido
	data := in.GetName()
	info := casoJSON{}
	json.Unmarshal([]byte(data), &info)
	log.Printf("----- Received: %v", info.Name)

	//Crear conexion con mongodb
	clientOpts := options.Client().ApplyURI(fmt.Sprintf("mongodb+srv://dbUser:dbUser123@clustersuficiencia.knfyx.mongodb.net/enfermedades?retryWrites=true&w=majority"))
	client, err := mongo.Connect(context.TODO(), clientOpts)
	if err != nil {
		log.Printf("Error: %V", err)
	}

	//Check the conection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Printf("Error: %V", err)
	}

	collection := client.Database("covid").Collection("casoJSON")
	insertResult, err := collection.InsertOne(context.TODO(), info)
	
	if err != nil {
		log.Printf("Error: %V", err)
	}
	fmt.Println("Death Star had been inserted: ", insertResult)

	return &pb.HelloReply{Message: "Hello " + in.GetName()}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Printf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Printf("failed to serve: %v", err)
	}
}
