//Requerimientos y configuracion para que funque la api
const fs = require('fs');
const promisify = require('util').promisify;

const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv[2] || 8080;

let app = express();
let router = express.Router();

let ResourceAlreadyExistsError = require('./notificationApiErrors.js').ResourceAlreadyExistsError;
let ResourceNotFoundError = require('./notificationApiErrors.js').ResourceNotFoundError;
let BadRequestError = require('./notificationApiErrors.js').BadRequestError;
let InternalServerError = require('./notificationApiErrors.js').InternalServerError;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);

function loadNotifier(){
}

router.route('/subscribe').post(function(req, res){
    const data = req.body;
    let unqfy = loadNotifier();
    if(data.artistId === undefined || data.email === undefined) throw new BadRequestError;
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
    console.log(err);
})

//Levanta servicio en el puerto 8080
app.listen(port, () => console.log('Listening on ' + port));