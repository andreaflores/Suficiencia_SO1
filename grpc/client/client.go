package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

type caso struct {
	Name          string `json: "name"`
	Location      string `json: "location"`
	Age           int    `json: "age"`
	Infected_Type string `json: "infected_type"`
	State         string `json: "state"`
}

const (
	address     = "servergrpc:50051"
	defaultName = "world"
)

func NewCase(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	var nuevo caso
	err = json.Unmarshal(body, &nuevo)
	if err != nil {
		panic(err)
	}
	var jsonstr = string(`{"name":"` + nuevo.Name + `","location":"` + nuevo.Location + `","age":` + strconv.Itoa(nuevo.Age) + `,"infected_type":"` + nuevo.Infected_Type + `","state":"` + nuevo.State + `"}`)

	//Metodo gRPC
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Printf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewGreeterClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	ra, err := c.SayHello(ctx, &pb.HelloRequest{Name: jsonstr})
	if err != nil {
		log.Printf("could not greet: %v", err)
	}
	log.Printf("Greeting: %s", ra.GetMessage())
}

func Inicio(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "gRPC...")
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", Inicio).Methods("GET")
	router.HandleFunc("/NewCase", NewCase).Methods("POST")
	http.ListenAndServe(":5000", router)
}
