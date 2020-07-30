const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.port || 8000;

//CORS middleware
app.use(cors());

// Configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Dynamically reading file - api
 */
app.get('/get_meta_data/:module_name/:screen_name', (request, response) => {
    const module_name = request.params['module_name'];
    const screen_name = request.params['screen_name'];
    var startPath;
    const getDirectoryAndFile = (startPath) => {
        const directoriesToSkip = ['bower_components', 'node_modules', 'www', 'platforms'];
        startPath = startPath === undefined ? __dirname : startPath;
        fs.readdir(startPath, (err, directorys) => {
            directorys.forEach((directory, index) => {
                var fileShouldBeSkipped = directoriesToSkip.indexOf(directory) > -1;
                var fileName = path.join(startPath, directory);
                var stat = fs.lstatSync(fileName);
                var baseName = path.dirname(fileName).split(path.sep).pop()
                if (stat.isDirectory() && !fileShouldBeSkipped) {
                    getDirectoryAndFile(fileName);
                }
                else if (baseName === module_name && fileName.indexOf(screen_name + '.json') >= 0) {
                    var data = fs.readFileSync(fileName);
                    response.send(JSON.parse(data));
                }
            })
        });
    }
    getDirectoryAndFile(startPath);
});

app.listen(port, () => console.log(`Dynamic screen app listening on port ${port}!`));
