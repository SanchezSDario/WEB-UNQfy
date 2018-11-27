//const picklify = require('picklify'); // para cargar/guarfar unqfy
//const fs = require('fs'); // para cargar/guarfar unqfy
//const rp = require('request-promise'); //para manejar api request como promesas

class ArtistSubs{

	constructor(_artist){
		this.artist = _artist;
		this.subs = [];
	}

	getArtist(){
		return this.artist;
	}

	getSubs(){
		return this.subs;
	}

	addSub(subscriptor){
		this.subs.push(subscriptor);
	}
}

module.exports = ArtistSubs;
