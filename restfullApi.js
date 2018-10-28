//Requerimientos y configuracion para que funque la api
const fs = require('fs');
const promisify = require('util').promisify;

const unqmod = require('./unqfy'); // importamos el modulo unqfy

const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv[2] || 8080;

let app = express();
let router = express.Router();

let ResourceAlreadyExistsError = require('./apiErrors.js').ResourceAlreadyExistsError;
let BadRequestError = require('./apiErrors.js').BadRequestError;

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
app.use(errorHandler);

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
    const data = req.body;
    let unqfy = loadUnqfy();
    if(data.name === undefined || data.country === undefined) throw new BadRequestError;
    let artistData = {
        name: data.name,
        country: data.country
    }; 
    //chequear si falta algun parametro antes de agregar json a unqfy
    let artist = unqfy.addArtist(artistData);
    unqfy.saveAsync('data.json').then(() => {
        res.status(201);
        res.json(artist.toJSON());
        console.log("Agregado un nuevo artista con los siguientes datos");
        console.log(artist);
    });
})


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
    res.status(200);
    res.json(artist.toJSON());
    console.log("Datos del artista obtenido con el id " + req.params.artistId);
    console.log(artist);
});

/* Borrar artista por id
    TODO: Manejo de errores.
*/
router.route('/artists/:artistId').delete(function(req, res){
    let unqfy = loadUnqfy();
    unqfy.deleteArtistById(parseInt(req.params.artistId));
    unqfy.saveAsync('data.json').then(
        () => {
            res.status(204);
            res.json();
            console.log("Borrado artista con id " + req.params.artistId);
        }
    );
})

/* Buscar artista por nombre
    TODO: Manejo de errores.
*/
router.route('/artists').get(function(req, res){
    let unqfy = loadUnqfy();
    let artists = unqfy.getArtistsByName(req.query.name);
    res.status(200);
    res.json(artists);
    console.log("Resultado de la busqueda de artistas por nombre:");
    console.log(artists);
})


/* Agregar un album a un artista
    TODO: Manejo de errores.
*/
router.route('/albums').post(function(req, res, next){
    const data = req.body;
    let unqfy = loadUnqfy(); 
    if(data.name === undefined || data.year === undefined || data.artistId === undefined) throw new BadRequestError;
    let albumData = {
        artistId: data.artistId, //preguntar
        name: data.name,
        year: data.year
    }; 
    //chequer que el json este completo antes de agregar a unqfy
    let album = unqfy.addAlbum(albumData.artistId, albumData);
    unqfy.saveAsync('data.json').then(
        () =>{
            res.status(201);
            res.json(album.toJSON());
            console.log("Agregado nuevo album con los siguientes datos:");
            console.log(album);
        });
})

/* Obtener un album por id
    TODO: Manejo de errores.
*/
router.route('/albums/:albumId').get(function(req, res){
    let unqfy = loadUnqfy();
    let album = unqfy.getAlbumById(parseInt(req.params.albumId));
    res.status(200);
    res.json(album.toJSON());
    console.log("Datos del album obtenidos con el id " + req.params.albumId);
    console.log(album);
})

/* Borrar un album por id
    TODO: Manejo de errores.
*/
router.route('/albums/:albumId').delete(function(req, res){
    let unqfy = loadUnqfy();
    unqfy.deleteAlbumById(parseInt(req.params.albumId));
    unqfy.saveAsync('data.json').then(
        () =>{
            res.status(204);
            res.json();
            console.log("Borrado album con id " + req.params.albumId);
        })
})

/* Buscar albumes por nombre
    TODO: Manejo de errores.
*/
router.route('/albums').get(function(req, res){
    let unqfy = loadUnqfy();
    let albums = unqfy.getAlbumsByName(req.query.name);
    res.status(200);
    res.json(albums);
    console.log("Obtenido albumes que matchean con el nombre " + req.query.name);
    console.log(albums);
})

/* Buscar letra de una cancion
    TODO: Manejo de errores.
*/
router.route('/lyrics').get(function(req, res){
    let unqfy = loadUnqfy();
    let track = unqfy.getTrackById(parseInt(req.query.trackId));
    track.getLyrics().then(() =>{
        res.status(200);
        res.json({
            Name: track.name,
            lyrics: track.lyrics
        });
        console.log(`Obtenido lyrics para el track ${track.name}`);
        console.log(track.lyrics);
    });
})

function errorHandler(err, req, res, next){
    if(err.type == 'entity.parse.failed'){
        let error = new BadRequestError;
        res.status(error.statusCode);
        res.json(error.toJSON());
    }
    else{
        res.status(err.statusCode);
        res.json(err.toJSON());
    }
}

//Levanta servicio en el puerto 8080
app.listen(port, () => console.log('Listening on ' + port));