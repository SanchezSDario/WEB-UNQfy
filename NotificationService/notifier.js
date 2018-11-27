//const picklify = require('picklify'); // para cargar/guarfar unqfy
//const fs = require('fs'); // para cargar/guarfar unqfy
const rp = require('request-promise'); //para manejar api request como promesas

const ArtistSubs = require('./artistSubs.js');

let ResourceAlreadyExistsError = require('./notificationApiErrors.js').ResourceAlreadyExistsError;
let ResourceNotFoundError = require('./notificationApiErrors.js').ResourceNotFoundError;

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
		if(! this.hasArtist(artist.id)){
			let artistSub = new ArtistSubs(artist)
			this.artistsSubs.push(artistSub);
			return artistSub;
			
		}
		else throw new ResourceAlreadyExistsError;
	}

	//FIX_ME: Comunicarse con la pai de unqfy para saber si esta el artista
	hasArtist(artistId){
		return this.artistsSubs.map((artistSub) => {artistSub.artist.id;}).includes(artistId);
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
      		if(!this.hasArtist(artistId)){
      			let artistSub = this.addArtistSubs(response);
      			artistSub.addSub(sub);
      		}
      		else{
      			this.getArtistSubById(artistId).addSub(sub);
      		}
      		console.log(this.artistsSubs);
      		//let artistSub = this.addArtist(response.artists.items[0]);
      		//return ([response.artists.items[0], artist]);
    		}).catch(error => console.log(error));
	}
}

let notifier = new Notifier();
notifier.addSubToAnArtist(1, "dariosebastiansanchez@gmail.com");
notifier.addSubToAnArtist(1, "pablitoclavounclavito@gmail.com");

module.exports = Notifier;