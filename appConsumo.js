#!/usr/bin/node

//App consumo interactiva

var rest = require('restler');
var prompt = require('prompt');
var async = require('async');
prompt.message = 'Introduce';
prompt.delimiter = '> ';
var argv = process.argv;
var url = "127.0.0.1:3000/";
var acciones = "help quit listar registrar enviar listarUsuarios eliminarUsuario buscarMUsuario buscarEnMensajes".split(" "); // JS no tiene qw!

var funciones = new Object();
funciones = {
	help: function(callback){
		console.log("\n---Uso:");
		console.log("$ node appConsumo.js <accion> [<param1> [<param2]]");
		console.log("---Acciones permitidas:");
		console.log("help:\t\t   Muestra esta ayuda.");
		console.log("quit\t\t   Sale del programa.");
		console.log("listar:\t\t   Muestra la lista de todos los usuarios registrados y sus mensajes asociados.");
		console.log("registrar:\t   Registra un usuario en el servidor para permitirle enviar mensajes.");
		console.log("enviar:\t\t   Envia un mensaje nuevo.");
		console.log("listarUsuarios:\t   Muestra la lista de usuarios registrados en el servidor.");
		console.log("eliminarUsuario:   Elimina un usuario y todos sus mensajes.");
		console.log("buscarMUsuario:\t   Lista todos los mensajes de un usuario.");
		console.log("buscarEnMensajes:  Lista todos los mensajes que contengan el parametro de busqueda");
		setImmediate(callback);
	},
	quit: function(callback){
		console.log("bye~~\n");
		process.exit(0);
	},
	listar: function(callback){
		rest.get(url+'all').on('complete', function( data ) {
		    console.log( data );
		    setImmediate(callback);
		});
	},
	registrar: function(callback){
		prompt.get(['usuario'], function (errores, entrada) {
			rest.put( url + "registro/" + entrada.usuario).on('complete', function( data ) {
			    console.log( data );
			    setImmediate(callback);
			});
		});
	},
	enviar: function(callback){
		prompt.get(['usuario', 'mensaje'], function (errores, entrada) {
			rest.put( url + "add/" + entrada.usuario + "/" + entrada.mensaje).on('complete', function( data ) {
			    console.log( data );
			    setImmediate(callback);
			});
		});
	},
	listarUsuarios: function(callback){
		rest.get(url + "usuarios").on('complete', function( data ) {
		    console.log( data );
		    setImmediate(callback);
		});
	},
	eliminarUsuario: function(callback){
		prompt.get(['usuario'], function (errores, entrada) {
			rest.del(url + "eliminar/" + entrada.usuario).on('complete', function( data ) {
			    console.log( data );
			    setImmediate(callback);
			});
		});

	},
	buscarMUsuario: function(callback){
		prompt.get(['usuario'], function (errores, entrada) {
			rest.get(url + "search/usuario/" + entrada.usuario).on('complete', function( data ) {
			    console.log( data );
			    setImmediate(callback);
			});
		});

	},
	buscarEnMensajes: function(callback){
		prompt.get(['texto'], function (errores, entrada) {
			rest.get(url + "search/mensaje/" + entrada.texto).on('complete', function( data ) {
			    console.log( data );
			    setImmediate(callback);
			});
		});

	}
}


prompt.start();
console.log("Consumo de API");

async.forever(
	function(callback){
		console.log("\nAcciones:");
		console.log(acciones+"\n");
		prompt.get(['accion'], function (errores, entrada) {
			if(acciones.indexOf(entrada.accion) != -1){
				funciones[entrada.accion](callback);
			}else{
				console.log("La accion indicada no existe");
				callback();
			}
		});
	},
	function(err){}
);

