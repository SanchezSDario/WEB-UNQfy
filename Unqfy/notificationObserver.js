const picklify = require('picklify');
const rp = require('request-promise');

class NotificationObserver{

	constructor(_unqfy){
		if(_unqfy !== undefined){
			this.artists = _unqfy.getArtists();
			this.albums = _unqfy.collectAlbums();
			this.tracks = _unqfy.allTracks();
		}
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
		console.log("Artists");
		console.log(this.artists);
		console.log("unqfy");
		console.log(unqfy.getArtists());
		console.log(this.artists.length < unqfy.getArtists().length);
		if(this.artists.length < unqfy.getArtists().length){
			this.artists = unqfy.getArtists();
			this.logAddedArtist(unqfy);
		}
	}

	handleRemoveArtist(unqfy){
		if(this.artists.length > unqfy.getArtists().length){
			this.notifyRemovedArtist(unqfy);
			this.logRemovedArtist(unqfy);
      	}
	}

	handleAddAlbum(unqfy){
		if(this.albums.length < unqfy.collectAlbums().length){
			this.notifyAddedAlbum(unqfy);
			this.logAddedAlbum(unqfy);
      	}
	}

	handleRemoveAlbum(unqfy){
		if(this.albums.length > unqfy.collectAlbums().length){
			this.logRemovedAlbum(unqfy);
      	}	
	}

	handleAddTrack(unqfy){
		if(this.tracks.length < unqfy.allTracks().length){
			this.logAddedTrack(unqfy);
		}
	}

	handleRemoveTrack(unqfy){
		if(this.tracks.length > unqfy.allTracks().length){
			this.logRemovedTrack(unqfy);
		}
	}

	logAddedArtist(unqfy){
		console.log("log add artist")
		let artist = unqfy.getArtists()[unqfy.getArtists().length - 1];

		const options = {
			method: 'POST',
			uri: 'http://localhost:5001/api/log',
     		body: {
     			text: `Artista agregado: ${artist.getName()}`
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado!");
      	});
	}

	notifyRemovedArtist(unqfy){
		let artist = this.artists.filter(artist => unqfy.getArtists().indexOf(artist) < 0)[0];

		const options = {
			method: 'DELETE',
			uri: 'http://localhost:5000/api/subscriptions/',
   			body: { artistId: artist.getId()},
   			json: true,
   		}
      	
      	rp(options).then((response) => {
      		this.artists = unqfy.getArtists();
      	});
	}

	logRemovedArtist(unqfy){
		let artist = this.artists.filter(artist => unqfy.getArtists().indexOf(artist) < 0)[0];

		const options = {
			method: 'POST',
			uri: 'http://localhost:5001/api/log',
     		body: {
     			text: `Artista borrado: ${artist.getName()}`
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado!");
      	});
	}

	notifyAddedAlbum(unqfy){
		let album = unqfy.collectAlbums()[unqfy.collectAlbums().length - 1];
		let artist = unqfy.getArtistByAlbumId(album.getId());

		const options = {
			method: 'POST',
			uri: 'http://localhost:5000/api/notify/',
     		body: {
      			artistId: artist.getId(),
      			subject: `Nuevo album para el artista ${artist.getName()}`,
      			message: `Se ha agregado el album ${album.getName()} al artista ${artist.getName()}`,
   			},
   			json: true,
   		}

   		rp(options).then((response) => {
     		this.albums = unqfy.collectAlbums();
      	});
	}

	logAddedAlbum(unqfy){
		let album = unqfy.collectAlbums()[unqfy.collectAlbums().length - 1];

		const options = {
			method: 'POST',
			uri: 'http://localhost:5001/api/log',
     		body: {
     			text: `Album agregado: ${album.getName()}`
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado!");
      	});
	}

	logRemovedAlbum(unqfy){
		let album = this.albums.filter(album => unqfy.collectAlbums().indexOf(album) < 0)[0]

		const options = {
			method: 'POST',
			uri: 'http://localhost:5001/api/log',
     		body: {
     			text: `Album borrado: ${album.getName()}`
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado!");
      	});
	}

	logAddedTrack(unqfy){
		let track = unqfy.allTracks()[unqfy.allTracks().length - 1];

		const options = {
			method: 'POST',
			uri: 'http://localhost:5001/api/log',
     		body: {
     			text: `Track agregado: ${track.getName()}`
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado!");
      	});
	}

	logRemovedTrack(unqfy){
		let track = this.tracks.filter(track => unqfy.allTracks().indexOf(track) < 0)[0]

		const options = {
			method: 'POST',
			uri: 'http://localhost:5001/api/log',
     		body: {
     			text: `Track borrado: ${track.getName()}`
     		},
   			json: true,
   		}

   		rp(options).then((response) => {
     		console.log("Log enviado!");
      	});
	}
}

module.exports = NotificationObserver;