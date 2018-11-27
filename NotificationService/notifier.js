//const picklify = require('picklify'); // para cargar/guarfar unqfy
//const fs = require('fs'); // para cargar/guarfar unqfy
//const rp = require('request-promise'); //para manejar api request como promesas

const ArtistSubs = require('./artistSubs.js');

let ResourceAlreadyExistsError = require('./notificationApiErrors.js').ResourceAlreadyExistsError;
let ResourceNotFoundError = require('./notificationApiErrors.js').ResourceNotFoundError;

class Notifier{

	constructor(){
		this.artistsSubs = [];
	}

	getArtistsSubs(){
		return this.artistsSubs;
	}

	addArtistSubs(artist){
		if(! hasArtist(artist.getId())){
			this.artistsSubs.push(new ArtistSubs(artist));
		}
		else throw new ResourceAlreadyExistsError;
	}

	hasArtist(artistId){
		return this.artistSubs.map((artist) => artist.getId()).includes(artistId);
	}
	
	getArtistSubById(artistId){
		try{
			return this.artistSubs.find((artist) => artist.getId() === artistId);
		}
		catch(error){ throw new ResourceNotFoundError;}
	}

	addSubToAnArtist(artistId, sub){
		this.getArtistSubById(artistId).addSub(sub);
	}
}

module.exports = Notifier;