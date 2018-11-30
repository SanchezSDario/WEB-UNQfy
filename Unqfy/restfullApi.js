//Requerimientos y configuracion para que funque la api
const fs = require('fs');
const promisify = require('util').promisify;

const unqmod = require('./unqfy'); // importamos el modulo unqfy

const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv[2] || 5000;

let app = express();
let router = express.Router();

let ResourceAlreadyExistsError = require('./apiErrors.js').ResourceAlreadyExistsError;
let ResourceNotFoundError = require('./apiErrors.js').ResourceNotFoundError;
let BadRequestError = require('./apiErrors.js').BadRequestError;
let InternalServerError = require('./apiErrors.js').InternalServerError;

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function loadUnqfy(){
    let unqfy = new unqmod.UNQfy();
        if (fs.existsSync('data.json')) {
            unqfy = unqmod.UNQfy.load('data.json');
        }
    return unqfy;BadRequestError
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);

//Servicios que provee la api

router.route('/artists').post(function(req, res){
    const data = req.body;
    let unqfy = loadUnqfy();
    if(data.name === undefined || data.country === undefined) throw new BadRequestError;
    let artistData = {
        name: data.name,
        country: data.country
    }
    let artist = unqfy.addArtist(artistData);
    unqfy.saveAsync('data.json').then(() => {
        res.status(201);
        res.json(artist.toJSON());
        console.log("Agregado un nuevo artista con los siguientes datos");
        console.log(artist);
    });
})

router.route('/artists/:artistId').get(function (req, res) {
    let unqfy = loadUnqfy();
    let artist = unqfy.getArtistById(parseInt(req.params.artistId));
    res.status(200);
    res.json(artist.toJSON());
    console.log("Datos del artista obtenido con el id " + req.params.artistId);
    console.log(artist);
});


router.route('/artists/:artistId').delete(function(req, res){
    let unqfy = loadUnqfy();
    let id = req.params.artistId;
    if(id != "undefined"){
    unqfy.deleteArtistById(parseInt(id));
    unqfy.saveAsync('data.json').then(
        () => {
            res.status(204);
            res.json();
            console.log("Borrado artista con id " + req.params.artistId);
        }
    );
    } else {
        throw new ResourceNotFoundError;
    }
})


/* Buscar artista por nombre
    FIXME:
        * Deberia tirar RESOURCE_NOT_FOUND?
*/
router.route('/artists').get(function(req, res){
    let unqfy = loadUnqfy();
    let artists;
    if(req.query.name === undefined) artists = unqfy.getArtistsByName("");
    else artists = unqfy.getArtistsByName(req.query.name);
    res.status(200);
    res.json(artists);
    console.log("Resultado de la busqueda de artistas por nombre " + req.query.name + ":");
    console.log(artists);
})

router.route('/albums').post(function(req, res, next){
    const data = req.body;
    let unqfy = loadUnqfy(); 
    if(data.name === undefined || data.year === undefined || data.artistId === undefined) throw new BadRequestError;
    let albumData = {
        artistId: data.artistId,
        name: data.name,
        year: data.year
    };
    let album = unqfy.addAlbum(albumData.artistId, albumData);
    unqfy.saveAsync('data.json').then(
        () =>{
            res.status(201);
            res.json(album.toJSON());
            console.log("Agregado nuevo album con los siguientes datos:");
            console.log(album);
        });
})

router.route('/albums/:albumId').get(function(req, res){
    let unqfy = loadUnqfy();
    let id = req.params.albumId
    let album = unqfy.getAlbumById(parseInt(id));
    res.status(200);
    res.json(album.toJSON());
    console.log("Datos del album obtenidos con el id " + id);
    console.log(album);
})

router.route('/albums/:albumId').delete(function(req, res){
    let unqfy = loadUnqfy();
    let id = req.params.albumId;
    unqfy.deleteAlbumById(parseInt(id));
    unqfy.saveAsync('data.json').then(
        () =>{
            res.status(204);
            res.json();
            console.log("Borrado album con id " + id);
        })
    })

router.route('/albums').get(function(req, res){
    let unqfy = loadUnqfy();
    let albums;
    if(req.query.name === undefined) albums = unqfy.getAlbumsByName("");
    else albums = unqfy.getAlbumsByName(req.query.name);
    res.status(200);
    res.json(albums);
    console.log("Obtenido albumes que matchean con el nombre " + req.query.name);
    console.log(albums);
})

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
    console.log(err);
    if(err.type == 'entity.parse.failed'){
        //JSON INVALIDO
        let error = new BadRequestError;
        res.status(error.statusCode);
        res.json(error.toJSON());
    }
    if(err.statusCode === 409 ||
       err.statusCode === 404 ||
       err.statusCode === 400){
        res.status(err.statusCode);
        res.json(err.toJSON());
    }
    else{
        //FALLO INESPERADO
        console.log(err);
        let error = new InternalServerError;
        res.status(error.statusCode);
        res.json(error.toJSON());
    }
}

app.use((req, res, err) => {
    let error = new ResourceNotFoundError;
    res.status(error.statusCode);
    res.json(error.toJSON());
})

//Levanta servicio en el puerto 8080
app.listen(port, () => console.log('Listening on ' + port));
