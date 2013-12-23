#!/usr/bin/node

//Este servidor permitira un registro simple de usuarios (sin password)
//y almacenara mensajes que envie cada usuario en una variable local (no persistente).

var express = require('express');
var fs = require('fs');
var index = fs.readFileSync('index.html','utf8');

var app = express();



//Interfaz REST


//El objeto "contenido" guardara todos los usuarios y sus mensajes asociados con el siguiente formato (JSON):
//{
//usuario1: [mensaje1, mensajeN],
//usuarioN: [mensaje1, mensajeN]
//}
var contenido = new Object();

//Principal
app.get('/', function(req, res){
	res.send(index);
});

//Listar todo
app.get('/all', function(req, res){
	res.contentType('application/json');
	res.send(JSON.stringify(contenido));
});

//Listar usuarios
app.get('/usuarios', function(req, res){
	var u = [];
	for (key in contenido) //Cada Key es un usuario
	   u.push(key);

	res.send(JSON.stringify(u));
});

//Registrar un usuario
app.put('/registro/:usuario', function(req, res){
	if (!(req.params.usuario in contenido)){ //Si el usuario no existe
		contenido[req.params.usuario] = new Array(); //Crearle un array vacio de mensajes
		res.send({status:"done"});
	}else{
		res.contentType('application/json');
		res.status(304);
		res.send({status:'304'});
	}
});

//Enviar mensaje
app.put('/add/:usuario/:mensaje', function(req, res){
	if (req.params.usuario in contenido){ //Si el usuario existe
		contenido[req.params.usuario].push(req.params.mensaje); //Se le aniade el mensaje a su array
		res.send({status:"done"});
	}else{
		res.contentType('application/json');
		res.status(404);
		res.send({status:"404"});
	}
});

//Eliminar un usuario (y sus mensajes asociados)
app.delete('/eliminar/:usuario', function(req, res){
	if (req.params.usuario in contenido){ //Si el usuario existe
		delete contenido[req.params.usuario]; //Eliminarlo
		res.send({status:"done"});
	}else{
		res.contentType('application/json');
		res.status(404);
		res.send({status:"404"});
	}
});

//Buscar mensajes de un usuario
app.get('/search/usuario/:usuario', function(req, res){
	if (req.params.usuario in contenido){ //Si el usuario existe
		res.contentType('application/json');
		var respuesta = new Object();
		respuesta[req.params.usuario] = contenido[req.params.usuario];
		res.send(JSON.stringify(respuesta)); //Devolver su array de mensajes
	}else{
		res.contentType('application/json');
		res.status(404);
		res.send({status:"404"});
	}
});

//Buscar texto en mensajes
app.get('/search/mensaje/:mensaje', function(req, res){
	var busqueda = new Object(); //Resultados de la busqueda
	for (key in contenido){
		busqueda[key] = new Array();
		var encontrado = false;
		contenido[key].forEach(function (elemento) { //Para cada mensaje del usuario
			if(elemento.indexOf(req.params.mensaje) != -1){ //Si encontramos el substring en el mensaje
				busqueda[key].push(elemento);
				encontrado = true;
			}
		});
		if(!encontrado)
			delete busqueda[key]; //Eliminamos el array vacio de este usuario
	}
	res.contentType('application/json');
	res.send(JSON.stringify(busqueda));
});


app.listen(3000,
           process.env.OPENSHIFT_NODEJS_IP);
console.log('Servidor Express escuchando en puerto ' + 3000);
