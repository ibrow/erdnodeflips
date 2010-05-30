var sys = require('sys'),
    fs = require('fs'),
    http = require('http'),
    url = require('url');

// Node-CouchDB: http://github.com/felixge/node-couchdb
var couchdb = require('./libs/node-couchdb/lib/couchdb'),
    client = couchdb.createClient(5984, 'localhost'),
    db = client.db('erdnodeflips');

// Haml-js: http://github.com/creationix/haml-js
var haml = require('./libs/haml-js/lib/haml');

var doc_id = 'NOT_FOUND-2d36f401bc4b82c9160e1a4ea936aba3';

http.createServer(function (req, res) {
    var url_parts = url.parse(req.url);

    switch(url_parts.pathname) {
    case '/':
	display_root(url_parts.pathname, req, res);
	break;
    case '/create':
	display_create(url_parts.pathname, req, res);
	break;
    case '/edit':
	sys.puts("display edit");
	break;
    default:
	display_404(url_parts.pathname, req, res);
    }
    return;


    /**
     * Display the document root
     **/
    function display_root(url, req, res) {
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
    }

    /**
     * Display the list creat page
     **/
    function display_create(url, req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('./templates/create.haml', function(e, c) {
	    var data = {
		title: "Create New List",
		message: "Please enter up to 5 things to remember",
		url: url
	    };
	    var html = haml.render(c.toString(), {locals: data});
	    res.end(html);
	});
    }

    /**
     * Display the 404 page for content that can't be found
     **/
    function display_404(url, req, res) {
	res.writeHead(404, {'Content-Type': 'text/html'});
	res.write("<h1>404 Not Found</h1>");
	res.end("<p>The page you were looking for: "+url+" can not be found");
    }
}).listen(8000);
sys.puts('Server running at http://127.0.0.1:8000/');


