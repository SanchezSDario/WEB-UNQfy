//const picklify = require('picklify'); // para cargar/guarfar unqfy
//const fs = require('fs'); // para cargar/guarfar unqfy
const rp = require('request-promise'); //para manejar api request como promesas

const ArtistSubs = require('./artistSubs.js');

let ResourceAlreadyExistsError = require('./notificationApiErrors.js').ResourceAlreadyExistsError;
let ResourceNotFoundError = require('./notificationApiErrors.js').ResourceNotFoundError;
let RelatedResourceNotFoundError = require('./notificationApiErrors.js').RelatedResourceNotFoundError;

class Notifier{

	/*
		DISCLAIMER: LOS ARTISTAS TIENEN LA ESTRUCTURA DEL TOJSON DEL MISMO, NO DEL OBJETO
	*/

	constructor(){
		this.artistsSubs = [];
	}

	getArtistsSubs(){
		return this.artistsSubs;
	}

	addArtistSubs(artist){
		let artistSub = new ArtistSubs(artist)
		this.artistsSubs.push(artistSub);
		return artistSub;
	}

	hasArtist(artistId){
		return this.artistsSubs.map((artistSub) => artistSub.artist.id).includes(artistId);
	}
	
	getArtistSubById(artistId){
		try{
			return this.artistsSubs.find((artistSub) => artistSub.artist.id === artistId);
		}
		catch(error){ throw new ResourceNotFoundError;}
	}

	addSubToAnArtist(artistId, sub){
		const options = {
			url: 'http://localhost:8080/api/artists/'+ artistId,
      		json: true,
      	}
      	return rp.get(options).then((response) => {
      		console.log("Artista encontrado!");
      		let artistSub;
      		if(!this.hasArtist(artistId)){
      			console.log("No hay un registro de subscripciones para este artista.");
      			console.log("Felicidades! Eres el primer subscriptor de este artita.");
      			artistSub = this.addArtistSubs(response);
      			console.log(`Subscribiendo ${sub} al artista ${artistSub.artist.name}`);
      			artistSub.addSub(sub);
      		}
      		else{
      			artistSub = this.getArtistSubById(artistId);
      			console.log(`Subscribiendo ${sub} al artista ${artistSub.artist.name}.`);
      			artistSub.addSub(sub);
      		}
      		console.log(`${sub} subscripto al artista ${artistSub.artist.name}!`);
      		console.log("Este es el estado del artista y sus subscriptores:")
      		console.log(artistSub);
      		return artistSub;
      	});
	}

	removeSubFromArtist(artistId, sub){
		const options = {
			url: 'http://localhost:8080/api/artists/'+ artistId,
      		json: true,
      	}
      	return rp.get(options).then((response) => {
      		console.log("Artista encontrado!");
      		let artistSub;
      		if(this.hasArtist(artistId)){
      			artistSub = this.getArtistSubById(artistId);
      			console.log(`Desubscribiendo ${sub} al artista ${artistSub.artist.name}.`);
      			artistSub.removeSub(sub);
      		}
      		console.log(`${sub} desubscripto al artista ${artistSub.artist.name}.`);
      		console.log("Este es el estado del artista y sus subscriptores:")
      		console.log(artistSub);
      	});
	}
}

module.exports = Notifier;