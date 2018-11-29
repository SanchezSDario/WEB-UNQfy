const fs = require('fs');
const promisify = require('util').promisify;

const express = require('express');
const bodyParser = require('body-parser');

const port = process.argv[2] || 5001;

let app = express();
let router = express.Router();

const Logger = require('./logger.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', router);

let logger = new Logger();

router.route('/activate').post(function(req, res, next){
    logger.activate();
    res.status(200);
    res.json({});
    console.log("Log activado!");
})

router.route('/deactivate').post(function(req, res, next){
    logger.deactivate();
    res.status(200);
    res.json({});
    console.log("Log desactivado!");
})

router.route('/unqfyStatus').get(function(req, res, next){
	logger.getStatusOfUNQfy().then((response) => {
		res.status(200);
		res.json({status: "Oh my god... it's... it's Dead!"});
	}).catch(error => {
		res.status(200);
		res.json({status: "Alive!"});
	});
})

router.route('/notifierStatus').get(function(req, res, next){
	logger.getStatusOfNotifier().then(() => {
		res.status(200);
		res.json({status: "Oh my god... it's... it's Dead!"});
	}).catch(error => {
		res.status(200);
		res.json({status: "Alive!"});
	});
})

app.listen(port, () => console.log('Listening on ' + port));