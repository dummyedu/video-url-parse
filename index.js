const shelljs = require('shelljs');
const _ = require('lodash');
const program = require('commander');

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

var express = require('express');
var app = express();

app.get('/youtube/:watchId', function (req, res) {
	const watchId = req.params.watchId;
	getUrl(`https://www.youtube.com/watch?v=${watchId}`)
		.then(downloadUrl => {
			res.json({downloadUrl});
		});
});

app.listen(port, function () {
  console.log(`video url parse app listening on port ${port}!`);
});

