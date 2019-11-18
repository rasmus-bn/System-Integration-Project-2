const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const fs = require('fs');
const path = require('path');

const port = 3000;
// app.use(bodyParser.text({
//     'limit': '1000kb',
//     'extended': true,
//     'Content-Type': 'text/html',
// }));
app.use(bodyParser.json());

console.log('monkeyscene.blend exists')
console.log(fs.existsSync('monkeyscene.blend'));



app.post('/blendfile', (req, res) => {
    const jobId = req.body.jobId;
    if (!jobId) {
        const resMsg = {message:`jobId cannot be empty`};
        console.log(resMsg);
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(resMsg));
        return;
    }

    const dirPath = path.join(__dirname, 'files', jobId)
    fs.mkdirSync(dirPath, {recursive: true });
    const filePath = path.join(dirPath, `${jobId}.txt`)
    const wStream = fs.createWriteStream(filePath);
    console.log(jobId);
    console.log(dirPath);
    console.log(filePath);
    req.pipe(wStream);
    res.end();
});

app.get('/blendfile/:jobId', (req, res) => {
    const filePath = path.join(__dirname, 'monkeyscene.blend');
    const stat = fs.statSync(filePath);
    const jobId = req.params['jobId'];
    
    console.log(jobId);

    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="scene.blend"',
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
});

app.put('/blendfile/:jobId', (req, res) => {
    const jobId = req.params['jobId'];
    if(!fs.existsSync(`files/${jobId}/${jobId}.txt`)) {
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size,
            'Content-Disposition': 'attachment; filename="scene.blend"',
        });
    }
});

app.listen(port, ()=> console.log(`Listening on port ${port}`))








// var http = require('http'),
// fileSystem = require('fs'),
// path = require('path');

// http.createServer(function(request, response) {
// var filePath = path.join(__dirname, 'monkeyscene.blend');
// var stat = fileSystem.statSync(filePath);

// response.writeHead(200, {
//     'Content-Type': 'application/blend',
//     'Content-Length': stat.size
// });

// var readStream = fileSystem.createReadStream(filePath);
// // We replaced all the event handlers with a simple call to readStream.pipe()
// readStream.pipe(response);
// })
// .listen(2000);