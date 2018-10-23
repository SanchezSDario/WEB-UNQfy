//Requerimientos y configuracion para que funque la api
const fs = require('fs');
const promisify = require('util').promisify;
const writeFile = promisify(fs.writeFile);

const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv[2] || 8080;
const FILES_DIR = './data';

let app = express();
let router = express.Router();

let id = 0;
function generateId(){
    return id += 1;
}

app.use(bodyParser.json());
app.use('/api', router);

//Servicios que provee la api

/*Agregar un artista
    TODO: 
        * Chequear artista para ver si ya esta agregado y lanzar error. 409
        * Chequear URL para ver si es invalida o no y lanza error. 404
        * Chequear body del JSON para comprobar si es valido o no y lanzar error. 400
        * Chequear si faltan algun parametro en el JSON y lanzar error. 400
        * Lanzar error de fallo inserperado. 500
*/
router.route('/artists').post(function(req, res){
    const fileData = req.body;
    const fullPath = `${FILES_DIR}/artists`;

    writeFile(fullPath, fileData).then( ()=> {
        res.status(201);
        res.json({
            id: generateId(),
            name: fileData.name,
            country: fileData.country,
            albums: []
        });
    }).catch((error) => console.log(error));
    //catch((error) => {...})
});

/*Obtener un artista por id
    TODO: 
        * Chequear URL para ver si es invalida o no y lanza error. 404
        * Chequear id enviada para comprobar existencia de artista. 404
        * Chequear body del JSON para comprobar si es valido o no y lanzar error. 400
        * Chequear si faltan algun parametro en el JSON y lanzar error. 400
        * Lanzar error de fallo inserperado. 500
*/
router.route('/api/artists/:artistId').get(function (req, res) {
    const readFile = promisify(fs.readFile);
    const fullPath = '/api/artists/';

    readFile(fullPath).then( (data) => {
        res.status(200);
        res.json({
            id: data.id,
            name: data.name,
            country: data.country,
            albums: data.albums
        });
    }).catch((err) => {
        res.status(404);
        res.json({
            msg: 'File not Found',
            error: err,
        });
    });
});

//Levanta servicio en el puerto 8080
app.listen(port, () => console.log('Listening on ' + port));