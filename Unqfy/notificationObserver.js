const picklify = require('picklify');
const rp = require('request-promise');

class NotificationObserver{

	constructor(){
		this.artists = [];
		this.albums = [];
		this.tracks = [];
	}

	addObservable(unqfy){
		this.artists = unqfy.getArtists().concat([]);
		this.albums = unqfy.collectAlbums().concat([]);
		this.tracks = unqfy.allTracks().concat([]);
	}

	update(unqfy){
		this.handleAddArtist(unqfy);
		this.handleRemoveArtist(unqfy);
		this.handleAddAlbum(unqfy);
		this.handleRemoveAlbum(unqfy);
		this.handleAddTrack(unqfy);
		this.handleRemoveTrack(unqfy);
	}

	handleAddArtist(unqfy){
		if(this.artists.length < unqfy.getArtists().length){
			this.artists = unqfy.getArtists();
			this.logAddedArtist(unqfy);
			this.artists = unqfy.getArtists().concat([]);
		}
	}

	handleRemoveArtist(unqfy){
		if(this.artists.length > unqfy.getArtists().length){
			this.notifyRemovedArtist(unqfy);
			this.logRemovedArtist(unqfy);
			this.artists = unqfy.getArtists().concat([]);
      	}
	}

	handleAddAlbum(unqfy){
		if(this.albums.length < unqfy.collectAlbums().length){
			this.notifyAddedAlbum(unqfy);
			this.logAddedAlbum(unqfy);
			this.albums = unqfy.collectAlbums().concat([]);
      	}
	}

	handleRemoveAlbum(unqfy){
		if(this.albums.length > unqfy.collectAlbums().length){
			this.logRemovedAlbum(unqfy);
			this.albums = unqfy.collectAlbums().concat([]);
      	}	
	}

	handleAddTrack(unqfy){
		if(this.tracks.length < unqfy.allTracks().length){
			this.logAddedTrack(unqfy);
			this.tracks = unqfy.allTracks().concat([]);
		}
	}

	handleRemoveTrack(unqfy){
		if(this.tracks.length > unqfy.allTracks().length){
			this.logRemovedTrack(unqfy);
			this.tracks = unqfy.allTracks().concat([]);
		}
	}

	logAddedArtist(unqfy){
		console.log("log add artist")
		let artist = unqfy.getArtists()[unqfy.getArtists().length - 1];
		let texto = `Artista agregado: ${artist.getName()}` 

		const options = {
			method: 'POST',
			uri: 'http://localhost:5002/api/log',
     		body: {
     			text: texto
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado: add artist!");
      	});
	}

	notifyRemovedArtist(unqfy){
		let artist = this.artists.filter(artist => unqfy.getArtists().indexOf(artist) < 0)[0];

		const options = {
			method: 'DELETE',
			uri: 'http://localhost:5001/api/subscriptions/',
   			body: { artistId: artist.getId()},
   			json: true,
   		}
      	
      	rp(options).then((response) => {
      		console.log("Notificacion enviada: remove artist!");
      	});
	}

	logRemovedArtist(unqfy){
		let artist = this.artists.filter(artist => unqfy.getArtists().indexOf(artist) < 0)[0];
		let texto = `Artista borrado: ${artist.getName()}` 

		const options = {
			method: 'POST',
			uri: 'http://localhost:5002/api/log',
     		body: {
     			text: texto
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado: remove artist!");
      	});
	}

	notifyAddedAlbum(unqfy){
		let album = unqfy.collectAlbums()[unqfy.collectAlbums().length - 1];
		let artist = unqfy.getArtistByAlbumId(album.getId());

		const options = {
			method: 'POST',
			uri: 'http://localhost:5001/api/notify/',
     		body: {
      			artistId: artist.getId(),
      			subject: `Nuevo album para el artista ${artist.getName()}`,
      			message: `Se ha agregado el album ${album.getName()} al artista ${artist.getName()}`,
   			},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Notificacion enviada: add album!");
      	});
	}

	logAddedAlbum(unqfy){
		let album = unqfy.collectAlbums()[unqfy.collectAlbums().length - 1];
		let texto = `Album agregado: ${album.getName()}`

		const options = {
			method: 'POST',
			uri: 'http://localhost:5002/api/log',
     		body: {
     			text: texto
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado: add album!");
      	});
	}

	logRemovedAlbum(unqfy){
		let album = this.albums.filter(album => unqfy.collectAlbums().indexOf(album) < 0)[0]
		let texto = `Album borrado: ${album.getName()}`

		const options = {
			method: 'POST',
			uri: 'http://localhost:5002/api/log',
     		body: {
     			text: texto
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado: remove album!");
      	});
	}

	logAddedTrack(unqfy){
		let track = unqfy.allTracks()[unqfy.allTracks().length - 1];
		let texto = `Track agregado: ${track.getName()}` 

		const options = {
			method: 'POST',
			uri: 'http://localhost:5002/api/log',
     		body: {
     			text: texto
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado: add track!");
      	});
	}

	logRemovedTrack(unqfy){
		let track = this.tracks.filter(track => unqfy.allTracks().indexOf(track) < 0)[0]
		let texto = `Track borrado: ${track.getName()}`

		const options = {
			method: 'POST',
			uri: 'http://localhost:5002/api/log',
     		body: {
     			text: texto
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado: remove track!");
      	});
	}
}

module.exports = NotificationObserver;