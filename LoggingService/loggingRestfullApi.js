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
    logger.activate().then(() => {
    	res.status(200);
    	res.json({});
    	console.log("Log activado!");	
    });
})

router.route('/deactivate').post(function(req, res, next){
    logger.deactivate().then(() => {
    	res.status(200);
    	res.json({});
    	console.log("Log desactivado!");    	
    });
})

router.route('/unqfyStatus').get(function(req, res, next){
	logger.getStatusOfUNQfy().then((response) => {
		console.log("Unqfy no se encuentra activado");
		res.status(200);
		res.json({
			object: "Unqfy",
			status: "Oh my god... it's... it's Dead!"
		});
		logger.log("Unqfy no se encuentra activado");
	}).catch(error => {
		console.log("Unqfy se encuentra activado");
		res.status(200);
		res.json({
			object: "Unqfy",
			status: "Is Alive! the Doc is alive!"
		});
		logger.log("Unqfy se encuentra activado");
	});
})

router.route('/notifierStatus').get(function(req, res, next){
	logger.getStatusOfNotifier().then(() => {
		console.log("El sistema de notificacion no se encuentra activado");
		res.status(200);
		res.json({
			object: "Notifier",
			status: "Oh my god... it's... it's Dead!"
		});
		logger.log("El sistema de notificacion no se encuentra activado");
	}).catch(error => {
		console.log("El sistema de notificacion se encuentra activado");
		res.status(200);
		res.json({
			object: "Notifier",
			status: "Is Alive! the Doc is alive!"
		});
		logger.log("El sistema de notificacion se encuentra activado");
	});
})

router.route('/log').post(function(req, res, next){
	const data = req.body;
	logger.log(data.text).then(() => {
		res.status(200);
		res.json({
			information: "Log enviado a Slack!"
		});
	});
})

app.listen(port, () => console.log('Listening on ' + port));