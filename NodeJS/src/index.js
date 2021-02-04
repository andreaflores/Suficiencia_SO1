'use strict'

const express = require('express')
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


const Infectado = require('../models/infectado')
//const Contador = require('../models/contador')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
var database;
var collection;

const urlmongo = "mongodb+srv://dbUser:dbUser123@clustersuficiencia.knfyx.mongodb.net/enfermedades?retryWrites=true&w=majority"

app.listen( 3001, () => {
	console.log("Server Running");
	MongoClient.connect(urlmongo, {useNewUrlParser: true}, (error, client) => {
		if(error){
			throw error;
		}
		database = client.db("covid");
               	collection = database.collection("casoJSON");
               	console.log("Mongo Success!");
	});
});

app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://104.197.230.46:3000');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    
        // Pass to next layer of middleware
        next();
    });

//Informacion por estado
app.get("/departamento", (req, res) => {
    collection.find({}).toArray( (err, result) => {
            if (err){
                    return res.status(500).send(err);
            }
            let responseJson = {};
            let tempJson = {};
            let tempArr = [];
            result.forEach( element => {
                    if( ! (element['location'] in tempJson) ){
                            tempJson[element['location']] = 1;
                    } else {
                            tempJson[element['location']] += 1;
                    }
            });
            for ( const property in tempJson ) {
                    tempArr.push(new Object({"departamento":property,"cantidad":tempJson[property]}));
            }
            tempArr.sort( (a,b) => (a.cantidad < b.cantidad) ? 1 : -1 );
            res.send(tempArr)
    });
});

//Informacion por tipo
app.get("/infectedtype", (req, res) => {
        collection.find({}).toArray( (err, result) => {
                if (err){
                        return res.status(500).send(err);
                }
                let responseJson = {};
                let tempJson = {};
                let tempArr = [];
                result.forEach( element => {
                        if( ! (element['infected_type'] in tempJson) ){
                                tempJson[element['infected_type']] = 1;
                        } else {
                                tempJson[element['infected_type']] += 1;
                        }
                });
                for ( const property in tempJson ) {
                        tempArr.push(new Object({"infected_type":property,"cantidad":tempJson[property]}));
                }
                tempArr.sort( (a,b) => (a.cantidad < b.cantidad) ? 1 : -1 );
                res.send(tempArr)
        });
    });

//Informacion por estado
app.get("/state", (req, res) => {
        collection.find({}).toArray( (err, result) => {
                if (err){
                        return res.status(500).send(err);
                }
                let responseJson = {};
                let tempJson = {};
                let tempArr = [];
                result.forEach( element => {
                        if( ! (element['state'] in tempJson) ){
                                tempJson[element['state']] = 1;
                        } else {
                                tempJson[element['state']] += 1;
                        }
                });
                for ( const property in tempJson ) {
                        tempArr.push(new Object({"state":property,"cantidad":tempJson[property]}));
                }
                tempArr.sort( (a,b) => (a.cantidad < b.cantidad) ? 1 : -1 );
                res.send(tempArr)
        });
    });

//Recopilacion de datos
app.get("/all", (req, res) => {
    collection.find({}).toArray( (err, result) => {
            if (err){
                    return res.status(500).send(err);
            }
            res.send(result)
    });
});

//Rango de edades
app.get("/edad", (req, res) => {
    collection.find({}).toArray( (err, result) => {
            if (err){
                    return res.status(500).send(err);
            }
            let responseJson = {
        "0-10":0,
        "11-20":0,
        "21-30":0,
        "31-40":0,
        "41-50":0,
        "51-60":0,
        "61-70":0,
        "71-80":0,
        "81-90":0,
        "91-100":0
    };
            let tempArr = [];
            result.forEach( element => {
                    if( Number(element['age']) >= 0 && Number(element['age']) <= 10 ){
                            responseJson["0-10"] += 1;
                    } else if( Number(element['age']) >= 11 && Number(element['age']) <= 20 ){
                            responseJson["11-20"] += 1;
                    } else if( Number(element['age']) >= 21 && Number(element['age']) <= 30 ){
                            responseJson["21-30"] += 1;
                    } else if( Number(element['age']) >= 31 && Number(element['age']) <= 40 ){
                            responseJson["31-40"] += 1;
                    } else if( Number(element['age']) >= 41 && Number(element['age']) <= 50 ){
                            responseJson["41-50"] += 1;
                    } else if( Number(element['age']) >= 51 && Number(element['age']) <= 60 ){
                            responseJson["51-60"] += 1;
                    } else if( Number(element['age']) >= 61 && Number(element['age']) <= 70 ){
                            responseJson["61-70"] += 1;
                    } else if( Number(element['age']) >= 71 && Number(element['age']) <= 80 ){
                            responseJson["71-80"] += 1;
                    } else if( Number(element['age']) >= 81 && Number(element['age']) <= 90 ){
                            responseJson["81-90"] += 1;
                    } else if( Number(element['age']) >= 91 && Number(element['age']) <= 100 ){
                            responseJson["91-100"] += 1;
                    } else {}
            });
            for ( const property in responseJson ) {
                    tempArr.push(new Object({"rango_edades":property,"cantidad":responseJson[property]}));
            }
            res.send(tempArr)
    });
});

//Top 3 de areas infectadas
app.get("/topDepartamentos", (req, res) => {
	collection.find({}).toArray( (err, result) => {
		if (err){
			return res.status(500).send(err);
		}
		let responseJson = {};
		let tempJson = {};
		let tempArr = [];
		result.forEach( element => {
			if( ! (element['location'] in tempJson) ){
				tempJson[element['location']] = 1;
			} else {
				tempJson[element['location']] += 1;
			}
		});
		for ( const property in tempJson ) {
			tempArr.push(new Object({"departamento":property,"cantidad":tempJson[property]}));
		}
		tempArr.sort( (a,b) => (a.cantidad < b.cantidad) ? 1 : -1 );
		tempArr = tempArr.slice(0,3);
		res.send(tempArr)
	});
});
