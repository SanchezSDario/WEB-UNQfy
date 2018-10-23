//Requerimientos y configuracion para que funque la api
const fs = require('fs');
const promisify = require('util').promisify;
const writeFile = promisify(fs.writeFile);

const unqmod = require('./unqfy'); // importamos el modulo unqfy

const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv[2] || 8080;

let app = express();
let router = express.Router();

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function loadUnqfy(){
    let unqfy = new unqmod.UNQfy();
        if (fs.existsSync('data.json')) {
            unqfy = unqmod.UNQfy.load('data.json');
        }
    return unqfy;
}

app.use(bodyParser.json());
app.use('/api', router);

//Servicios que provee la api

/*Agregar un artista
    TODO: 
        //Ojo con ver donde va el error si al rest o desde unqfy
        * Chequear artista para ver si ya esta agregado y lanzar error. 409
        * Chequear URL para ver si es invalida o no y lanza error. 404
        * Chequear body del JSON para comprobar si es valido o no y lanzar error. 400
        * Chequear si faltan algun parametro en el JSON y lanzar error. 400
        * Lanzar error de fallo inserperado. 500
*/
router.route('/artists').post(function(req, res){
    const fileData = req.body;
    let unqfy = loadUnqfy();
    let artistData = {
        name: fileData.name,
        country: fileData.country
    };
    let artist = unqfy.addArtist(artistData);
    unqfy.saveAsync('data.json').then(
        () => res.json(artist.toJSON()) 
    );
});

/*Obtener un artista por id
    TODO:
        //Ojo con ver donde va el error si al rest o desde unqfy
        * Chequear URL para ver si es invalida o no y lanza error. 404
        * Chequear id enviada para comprobar existencia de artista. 404
        * Chequear body del JSON para comprobar si es valido o no y lanzar error. 400
        * Chequear si faltan algun parametro en el JSON y lanzar error. 400
        * Lanzar error de fallo inserperado. 500
*/
router.route('/artists/:artistId').get(function (req, res) {
    let unqfy = loadUnqfy();
    let artist = unqfy.getArtistById(parseInt(req.params.artistId));
    res.json(artist.toJSON());
});

//Levanta servicio en el puerto 8080
app.listen(port, () => console.log('Listening on ' + port));