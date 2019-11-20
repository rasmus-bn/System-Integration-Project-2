const express = require('express');
const bodyParser= require('body-parser');
const multer = require('multer');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'filesdir');
fs.mkdirSync(filesDir, { recursive: true });
const app = express();
const port = 3000;
app.use(bodyParser.json());

const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        if (file.fieldname === 'blendFile') {
            const jobPath = path.join(filesDir, req.params['jobId']);
            console.log(path.join(jobPath, 'blend'))
            if (!fs.existsSync(jobPath)) {
                return cb(new Error(`Invalid job`));
            }
            const blendPath = path.join(jobPath, 'blend');
            if (fs.existsSync(path.join(blendPath, 'scene.blend'))) {
                return cb(new Error(`File already exists`));
            }
            fs.mkdirSync(blendPath, {recursive: true });
            cb(null, blendPath);
        } else {
            const jobPath = path.join(filesDir, req.params['jobId']);
            console.log(path.join(jobPath, 'output'));
            if (!fs.existsSync(path.join(jobPath, 'blend', 'scene.blend'))) {
                return cb(new Error('No .blend for the job'));
            }
            if (fs.existsSync(path.join(blendPath, 'output', 'output.zip'))) {
                return cb(new Error('Output already uploaded'));
            }
            cb(null, path.join(jobPath, 'output'));
        }
    },
    filename: function (req, file, cb) {
        if (file.fieldname === 'blendFile') cb(null, 'scene.blend');
        else cb(null, 'output.zip');
    },
});
function fileFilter(req, file, cb) {
    const fileExt = path.extname(file.originalname);
    if (file.fieldname === 'blendFile' && fileExt !== '.blend') {
        return cb(new Error(`Only .blend files are allowed. Got ${fileExt}`));
    }
    if (file.fieldname === 'output' && fileExt !== '.zip') {
        return cb(new Error(`Only .zip files are allowed. Got ${fileExt}`));
    }
    cb(null, true);
}
const upload = multer({ storage: storage, fileFilter: fileFilter, });


app.post('/blendfile', upload.none(), (req, res) => {
    const jobId = req.body.jobId;
    if (!jobId) {
        const resMsg = {message:`jobId cannot be empty`};
        console.log(resMsg);
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(resMsg));
        return;
    }

    const dirPath = path.join(filesDir, jobId)
    fs.mkdirSync(dirPath, {recursive: true });
    const filePath = path.join(dirPath, `${jobId}.txt`)
    const wStream = fs.createWriteStream(filePath);
    console.log(jobId);
    console.log(dirPath);
    console.log(filePath);
    req.pipe(wStream);
    res.end();
});

app.get('/blendfile/:jobId', upload.none(), (req, res) => {
    const jobId = req.params['jobId'];
    const jobPath = path.join(filesDir, jobId);
    const stat = fs.statSync(jobPath);

    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="${jobId}.zip"`,
    });

    let zip = archiver('zip', {
        zlib: { level: 9 },
    });
    zip.directory(jobPath, jobId);
    zip.on('error', (err) => console.log('error'));
    zip.on('end', (err) => console.log('end'));
    zip.on('close', (err) => console.log('close'));
    zip.on('warning', (err) => console.log('warning'));
    zip.pipe(res);
    zip.finalize();
});

app.put(
    '/blendfile/:jobId', 
    upload.fields([
        { name: 'blendFile', maxCount: 1 },
        { name: 'output', maxCount: 1 },
    ]), 
    (req, res) => {
    const jobId = req.params['jobId'];
    const resMsg = { message:`File uploaded for job ${jobId}` };
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(resMsg));
});

app.listen(port, ()=> console.log(`Listening on port ${port}`));