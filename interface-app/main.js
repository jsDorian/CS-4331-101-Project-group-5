const path = require('path');
const sqlite3 = require('sqlite3').verbose();

var tls = require('tls'),
    fs = require('fs');

var options = {
  key: fs.readFileSync('key-cert/shs-private.pem'),
  cert: fs.readFileSync('key-cert/shs-public.pem')
};

var conn = tls.connect(8080, options, function() {
  if (conn.authorized) {
    console.log("Connection authorized by a Certificate Authority.");
  } else {
    console.log("Connection not authorized: " + conn.authorizationError)
  }
    console.log();
});

conn.on("data", function (data) {
  console.log(data.toString());
  conn.end();
});

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
  
  //setTimeout(() => {win.loadFile('index2.html')}, 5000);
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})