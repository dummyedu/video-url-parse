const shelljs = require('shelljs');
const _ = require('lodash');
const program = require('commander');
const fs = require('fs');
const http = require('http');
const https = require('https');

program
  .version('1.0.0')
  .option('-p, --port <string>', 'server port')
  .parse(process.argv);

const port = parseInt(program.port, 10) || 4010;

const getUrl = url => {
	return new Promise((resolve, reject) => {
		shelljs.exec(`youtube-dl -g ${url}`, function(code, stdout, stderr) {
			if (stdout != null && stdout.length > 0) {
				resolve(stdout.split('\n')[0]);
			} else {
				reject();
			}
		});
	})
	
}

const express = require('express');
const app = express();

app.get('/youtube/:watchId', function (req, res) {
	const watchId = req.params.watchId;
	getUrl(`https://www.youtube.com/watch?v=${watchId}`)
		.then(downloadUrl => {
			res.json({downloadUrl});
		});
});


const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(port);
httpsServer.listen(port + 1);

