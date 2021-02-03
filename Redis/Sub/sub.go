package main

import (
	"encoding/json"
	"fmt"
	"log"

	"context"

	"time"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type caso struct {
	Name          string `json: "name"`
	Location      string `json: "location"`
	Age           int    `json: "age"`
	Infected_Type string `json: "infected_type"`
	State         string `json: "state"`
}

var ctx = context.Background()

const (
	port   = ":50051"
	host   = "localhost"
	portdb = "27017"
)

func main() {

	// --> creacion de la conexion a redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     "35.223.38.239:6379",
		Password: "sufi",
		DB:       0, // default DB
	})

	for {

		time.NewTicker(2 * time.Second)

		//--> Nos subscribimos al canal "casos"
		sub := rdb.PSubscribe(ctx, "casos")

		//--> recibimos las publicaciones en redis
		msg, err := sub.ReceiveMessage(ctx)
		if err != nil {
			panic(err)
		}

		fmt.Println("casos", msg.Payload)

		//--> lo insertamos en redis como un string del json en una lista
		key := "listacasos"
		rdb.LPush(ctx, key, msg.Payload)

		//Deserializar json recibido
		var nuevo caso
		datos := []byte(msg.Payload)
		err = json.Unmarshal(datos, &nuevo)

		//Crear conexion con mongodb
		clientOpts := options.Client().ApplyURI(fmt.Sprintf("mongodb+srv://dbUser:dbUser123@clustersuficiencia.knfyx.mongodb.net/enfermedades?retryWrites=true&w=majority"))
		client, err := mongo.Connect(context.TODO(), clientOpts)
		if err != nil {
			log.Fatal(err)
		}

		//Check the conection
		err = client.Ping(context.TODO(), nil)
		if err != nil {
			log.Fatal(err)
		}
		collection := client.Database("covid").Collection("casoJSON")
		insertResult, err := collection.InsertOne(context.TODO(), nuevo)
		if err != nil {
			log.Fatal(err)
		}
		
		fmt.Println("Death Star had been inserted x) ", insertResult)
	}
}