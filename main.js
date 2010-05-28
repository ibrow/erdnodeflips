var sys = require('sys'),
    fs = require('fs'),
    http = require('http');

// Node-CouchDB: http://github.com/felixge/node-couchdb
var couchdb = require('./libs/node-couchdb/lib/couchdb'),
    client = couchdb.createClient(5984, 'localhost'),
    db = client.db('erdnodeflips');

// Haml-js: http://github.com/creationix/haml-js
var haml = require('./libs/haml-js/lib/haml');

var doc_id = 'ROB2d36f401bc4b82c9160e1a4ea936aba3';

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    db.getDoc(doc_id, function(error, doc) {
	if(error) {
	    fs.readFile('./templates/no-doc.haml', function(e, c) {
		var data = {
		    title: "No Document Found",
		    message: "No document could be found",
		    link: "/create",
		    link_text: "Create a new document"
		};
		var html = haml.render(c.toString(), {locals: data});
		res.end(html);
	    });
	}
	else {
	    fs.readFile('./templates/doc.haml', function(e, c) {
		var data = {
		    title: "Erdnodeflip document: "+doc.name,
		    message: "Your Erdnusflip document was found!",
		    items: doc.items,
		};
		var html = haml.render(c.toString(), {locals: data});
		res.end(html);
	    });
	}
    });

}).listen(8000);
sys.puts('Server running at http://127.0.0.1:8000/');


/*
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    db.getDoc(doc_id, function(error, doc) {
	if(error) {	   
	    fs.readFile('./templates/no-doc.haml', function(e, c) {
		var data = {
		    title: "No Document Found",
		    message: "No document could be found",
		    link: "/create",
		    link_text: "Create a new document"
		};
		var html = haml.render(c.toString(), {locals: data});
		res.end(html);
	    });
	}
	else {
	    res.write('Fetched my new doc from couch:');
	    res.write(JSON.stringify(doc));
	    res.end("-= Fin =-");
	}
    });

}).listen(8000);
sys.puts('Server running at http://127.0.0.1:8000/');
*/