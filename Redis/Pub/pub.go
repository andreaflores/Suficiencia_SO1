package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

type caso struct {
	Name          string `json: "name"`
	Location      string `json: "location"`
	Age           int    `json: "age"`
	Infected_Type string `json: "infected_type"`
	State         string `json: "state"`
}

var ctx = context.Background()

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

	//--> conexion con redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     "35.223.38.239:6379",
		Password: "sufi",
		DB:       0, // default DB
	})

	//vamos a publicar al canal "casos" en redis el string del json
	rdb.Publish(ctx, "casos", jsonstr)

	fmt.Fprintf(w, jsonstr)
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/NewCase", NewCase).Methods("POST")
	log.Fatal(http.ListenAndServe(":5000", router))
}
