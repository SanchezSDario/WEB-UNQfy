
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const Artist = require('./artist.js');
const Album = require('./album.js');
const Track = require('./track.js');
const Playlist = require('./playlist.js');

class UNQfy {

  constructor(){
    this.artists = []
    this.playlists = []
    this.numId = 1;
  }
  
  generateID(){
    return this.numId++;
  }

  // artistData: objeto JS con los datos necesarios para crear un artista
  //   artistData.name (string)
  //   artistData.country (string)
  // retorna: el nuevo artista creado
  addArtist(artistData) {
  /* Crea un artista y lo agrega a unqfy.
  El objeto artista creado debe soportar (al menos):
    - una propiedad name (string)
    - una propiedad country (string)
  */
  
  //Se puso el ID por default hasta definir como lo vamos a generar
  let artistToAdd = new Artist(this.generateID(), artistData.name, artistData.country);
  //console.log(artistToAdd);
  
    if(!this.artists.includes(artistToAdd)){
            this.artists.push(artistToAdd);
     //       console.log(this.artists);
            return artistToAdd;
        } else {
            throw "El artista ya esta incluido";
        }
  }     


  // albumData: objeto JS con los datos necesarios para crear un album
  //   albumData.name (string)
  //   albumData.year (number)
  // retorna: el nuevo album creado
  addAlbum(artistId, albumData) {
  /* Crea un album y lo agrega al artista con id artistId.
    El objeto album creado debe tener (al menos):
     - una propiedad name (string)
     - una propiedad year (number)
  */
  let albumToAdd = new Album(this.generateID(), albumData.name, albumData.year);
  //console.log(albumToAdd); 
  if(posibleAddAlbum(artistId , albumToAdd.getId)){
        this.getArtistById.getAlbums.push(albumToAdd);
  } 
  else { 
    throw ("El artista no existe o el artista ya contiene este album");
  }
  
} 

posibleAddAlbum (artistId , idAlbum){
  return !this.getArtistById.getAlbums.map((a)=>a.getId).includes(idAlbum); 
  
}


  // trackData: objeto JS con los datos necesarios para crear un track
  //   trackData.name (string)
  //   trackData.duration (number)
  //   trackData.genres (lista de strings)
  // retorna: el nuevo track creado
  addTrack(albumId, trackData) {
  /* Crea un track y lo agrega al album con id albumId.
  El objeto track creado debe tener (al menos):
      - una propiedad name (string),
      - una propiedad duration (number),
      - una propiedad genres (lista de strings)
  */
  }

  getArtistById(id) { 
     
    try{ 
      this.artists.find((a)=>a.getId===id);
    }
    catch(error){
      console.log(error("el artista no existe"));
    }

    
  }

  getAlbumById(id) {

  }

  getTrackById(id) {

  }

  getPlaylistById(id) {

  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {

  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpredatos por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {

  }


  // name: nombre de la playlist
  // genresToInclude: array de generos
  // maxDuration: duración en segundos
  // retorna: la nueva playlist creada
  createPlaylist(name, genresToInclude, maxDuration) {
  /*** Crea una playlist y la agrega a unqfy. ***
    El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist.
  */

  }

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    //COMPLETAR POR EL ALUMNO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Artist, Album, Track, Playlist];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

