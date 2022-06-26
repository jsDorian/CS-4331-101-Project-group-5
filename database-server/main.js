const path = require('path');
const http = require('http');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const dbPath = 'db/test.db';

// create server
/*const requestListener = function (req, res) {
	var resp;
	var keyValue = getKeyValue(req.url);
	
	if (req.url.includes('/test')) {
		resp = readRecord(dbPath, res, keyValue.employeeId, keyValue.password);
	}
	
}*/
var tls = require('tls'),
    fs = require('fs'),
    msg = "hello world!";

var options = {
  key: fs.readFileSync('key-cert/shs-private.pem'),
  cert: fs.readFileSync('key-cert/shs-public.pem')
};

tls.createServer(options, function (s) {
  s.write(msg+"\n");
  s.pipe(s);
}).listen(8080);


let resultObj = class {}

function getKeyValue(url) {
    var keyValueStr = url.substr(url.indexOf('?') + 1);
	
    var results = new resultObj();;
    
    var keyValueArr = keyValueStr.split('&');

    for (var i = 0; i < keyValueArr.length; i++) {
        var keyValue = keyValueArr[i].split('=');
        
        results[keyValue[0]] = keyValue[1];
    }
	
    return results;
}

function dbTest(path) {
	//const db = connectDb(path);
	
	// todo: test readRecord
	//readRecord();
}

const server = http.createServer(requestListener);
server.listen(8080);

// launch interface app
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		if (server) {
			console.log('closing server...');
			server.close();
			console.log('server closed!');
		}
		
		app.quit()
	}
})

// create database if not exist
initDb(dbPath);

function connectDb(dbPath) {
	const db = new sqlite3.Database(dbPath);
	return db;
}

// initialize database
function initDb(path) {
	const db = connectDb(path);
	
	try {
		createTable(db);
	} catch (err) {
		console.log('Error creating table!');
	}
}

function createTable(db) {
	db.serialize(() => {
		db.run(`
			CREATE TABLE IF NOT EXISTS credentials (
				"employeeId"	TEXT NOT NULL UNIQUE,
				"password"	TEXT NOT NULL UNIQUE,
				PRIMARY KEY("employeeId"))  WITHOUT ROWID;`);
		
		db.each("SELECT employeeId, password FROM credentials", (err, row) => {
			if (row) {
				console.log(row.employeeId + ": " + row.password);
			} else {
				const stmt = db.prepare("INSERT INTO credentials VALUES (?, ?)");
				for (let i = 0; i < 10; i++) {
					stmt.run("Ipsum" + i, 'password' + i);
				}
				stmt.finalize();
			}
		});
	});
	
	db.close();
}

function _respCb(err, row) {
	var resp = '';
	
	if (row) {
		resp += row.employeeId + ' ' + row.password;
	} else {
		resp += 'undefined';
	}
	
	this.res.writeHead(200);
	this.res.end(resp);
	this.db.close();
}

// manage requests
function _serializeRead() {
	var stmt = "SELECT employeeId, password FROM credentials WHERE employeeId = '" + this.id + "' AND password = '" + this.password + "'";
	
	var respCb = _respCb.bind({
		db: this.db,
		res: this.res
	});
	this.db.each(stmt, respCb)
}

function readRecord(dbPath, res, id, password) {
	const db = connectDb(dbPath);
	
	var serializeRead = _serializeRead.bind({
		dbPath: dbPath,
		res: res,
		id: id,
		password: password,
		db: db
	});
	db.serialize(serializeRead);
}

function writeRecord(id, password) {
	const db = connectDb();
	
	db.serialize(() => {
		// TODO: create record
	});
	
	db.close();
}
