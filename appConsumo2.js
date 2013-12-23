#!/usr/bin/node

//Ejecutar el programa sin argumentos para ver la ayuda

var rest = require('restler');
var argv = process.argv;
var url = "127.0.0.1:3000/";
var acciones = "listar registrar enviar listarUsuarios eliminarUsuario buscarMUsuario buscarEnMensajes".split(" "); // JS no tiene qw!
var usuario;
var mensaje;


if(argv.length > 2){
	if(argv[2] == acciones[0]){ //lista elementos
		rest.get(url + "all").on('complete', function( data ) {
		    console.log( data );
		} );
	}else if(argv[2] == acciones[1]){ //registro usuario
		if(argv.length > 3){
			usuario = argv[3];
			rest.put( url + "registro/" + usuario).on('complete', function( data ) {
			    console.log( data );
			} );
		}else{
			console.log("Numero de argumentos incorrecto.");
		}
	}else if(argv[2] == acciones[2]){ //introducir mensaje
		if(argv.length > 4){
			usuario = argv[3];
			mensaje = argv[4];
			rest.put( url + "add/" + usuario + "/" + mensaje).on('complete', function( data ) {
			    console.log( data );
			} );
		}else{
			console.log("Numero de argumentos incorrecto.");
		}
	}else if(argv[2] == acciones[3]){ //lista usuarios
		rest.get(url + "usuarios").on('complete', function( data ) {
		    console.log( data );
		} );
	}else if(argv[2] == acciones[4]){ //eliminar usuario
		if(argv.length > 3){
			usuario = argv[3];
			rest.del(url + "eliminar/" + usuario).on('complete', function( data ) {
			    console.log( data );
			} );
		}else{
			console.log("Numero de argumentos incorrecto.");
		}
	}else if(argv[2] == acciones[5]){ //buscar mensajes usuario
		if(argv.length > 3){
			usuario = argv[3];
			rest.get(url + "search/usuario/" + usuario).on('complete', function( data ) {
			    console.log( data );
			} );
		}else{
			console.log("Numero de argumentos incorrecto.");
		}
	}else if(argv[2] == acciones[6]){ //buscar mensajes
		if(argv.length > 3){
			mensaje = argv[3];
			rest.get(url + "search/mensaje/" + mensaje).on('complete', function( data ) {
			    console.log( data );
			} );
		}else{
			console.log("Numero de argumentos incorrecto.");
		}
	}else{
		console.log("No se reconoce la accion '"+argv[2]+"'")
	}
}else{
	console.log("---Uso:");
	console.log("$ node appConsumo2.js <accion> [<param1> [<param2]]");
	console.log("---Acciones permitidas:");
	console.log("listar:\t\t   Muestra la lista de todos los usuarios registrados y sus mensajes asociados.");
	console.log("registrar:\t   Registra un usuario en el servidor para permitirle enviar mensajes.");
	console.log("\t\t\t<param1> = nombre de usuario");
	console.log("enviar:\t\t   Envia un mensaje nuevo.");
	console.log("\t\t\t<param1> = nombre de usuario registrado; <param2> = mensaje");
	console.log("listarUsuarios:\t   Muestra la lista de usuarios registrados en el servidor.");
	console.log("eliminarUsuario:   Elimina un usuario y todos sus mensajes.");
	console.log("\t\t\t<param1> = nombre de usuario registrado");
	console.log("buscarMUsuario:\t   Lista todos los mensajes de un usuario.");
	console.log("\t\t\t<param1> = nombre de usuario registrado");
	console.log("buscarEnMensajes:  Lista todos los mensajes que contengan el parametro de busqueda");
	console.log("\t\t\t<param1> = texto a buscar");
}

