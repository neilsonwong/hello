"use strict";

const LOGLEVEL = {
	"DEBUG": -1,
	"INFO": 0,
	"WARN": 1,
	"ERROR": 2,
};

let LOGGING = LOGLEVEL.INFO;

function log(){}

log.debug = function (str) {
	if (LOGGING >= LOGLEVEL.DEBUG){
		console.log(str);
	}
};

log.info = function (str) {
	if (LOGGING >= LOGLEVEL.INFO){
		console.log(str);
	}
};

log.warn = function (str) {
	if (LOGGING >= LOGLEVEL.WARN){
		console.log(str);
	}
};

log.error = function (str) {
	if (LOGGING >= LOGLEVEL.ERROR){
		console.log(str);
	}
};