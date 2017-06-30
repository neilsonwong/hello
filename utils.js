"use strict";
const crypto = require("crypto");
const path = require("path");
const glob = require("glob");

exports.hash = function hashthis(query){
	return crypto.createHmac("sha256", "hello")
		.update(query)
		.digest("hex");
};

exports.matchFile = function (folder, file){
	return new Promise((resolve/*, reject*/) => {
		let lookString = path.join(folder, "*" + file + "*");
		glob(lookString, function(err, matches) {
			if (err || matches.length < 1){
				resolve(null);
			}
			resolve(matches[0]);
		});
	});
};