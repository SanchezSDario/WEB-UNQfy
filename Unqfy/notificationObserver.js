const picklify = require('picklify');
const rp = require('request-promise');

class NotificationObserver{

	constructor(_unqfy){
		if(_unqfy !== undefined){
			this.albums = _unqfy.collectAlbums();
			this.artists = _unqfy.getArtists();
		}
	}

	update(unqfy){
		this.handleAddArtist(unqfy);
		this.handleNotifyAlbum(unqfy);
		this.handleRemoveArtist(unqfy);
	}

	handleAddArtist(unqfy){
		if(this.artists.length < unqfy.getArtists().length){
			this.artists = unqfy.getArtists();
		}
	}

	handleNotifyAlbum(unqfy){
		if(this.albums.length < unqfy.collectAlbums().length){
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
	}

	handleRemoveArtist(unqfy){
		if(this.artists.length > unqfy.getArtists().length){

			let artist = this.artists.filter(artist => unqfy.getArtists(artist) < 0)[0];

			const options = {
				method: 'DELETE',
				uri: 'http://localhost:5000/api/subscriptions/',
      			body: { artistId: artist.getId()},
      			json: true,
      		}

      		console.log(options);

      		rp(options).then((response) => {
      			this.artists = unqfy.getArtists();
      		});
      	}
	}
}

module.exports = NotificationObserver;