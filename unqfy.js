
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

  getArtists(){
    return this.artists;
  }

  generateID(){
    this.numId++
    return this.numId;
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

  
    if(!this.artists.includes(artistToAdd)){
            this.artists.push(artistToAdd);
            return artistToAdd;
        } else {
            throw new Error("El artista ya esta incluido");
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
    return this.getArtistById(artistId).addAlbum(this.generateID(), albumData);
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

    return this.getAlbumById(albumId).addTrack(this.generateID(), trackData);
  }

  //Retorna un artista mediante el id del mismo, de no estar en el sistema se arroja una exepcion
  getArtistById(id) { 
    let artist = this.artists.find((a)=>a.getId()===id);
    return this.returnIfExists(artist, "artista");
  }

  //Retorna un album mediante el id del mismo, de no estar en el sistema se arroja una exepcion
  getAlbumById(id) {
    let album = this.collectAlbums().find((a)=>a.id==id) ;
    return this.returnIfExists(album, "album");
  }

  getTrackById(id) {
    let albums = this.collectAlbums();
    let tracks  = this.collecTracks(albums);
    return this.returnIfExists(track , "track") ;
  }

  getPlaylistById(id) {
    let playlist = this.playlists.find((a)=>a.getId()===id);
    return this.returnIfExists(playlist, "playlist");
  }

  // Metodo auxiliar de los gettersById, recibe un objeto y un string que (preferentemente) es el nombre de
  // la clase que se busca.
  // Compara el objeto pasado con undefined, si cumple la condicion lanza una excepcion, de lo contrario retorna el objeto
  returnIfExists(obj, objName){
    if(obj === undefined){
      throw new Error("El/La " + objName + " no existe en el sistema");
    }
    else{return obj;}
  }

  // Retorna los albumes en el sistema, que son la suma de todos los albumes de todos los artistas
  collectAlbums(){
    let resultadoAlbums = this.artists.map((fArtist) => fArtist.albums);
    let flatResultado = resultadoAlbums.reduce(function(a, b) { 
        return a.concat(b);         
    });
    return flatResultado;
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    let albums = this.collectAlbums();
    let tracks = this.collecTracks(albums);
 
    let result = tracks.filter((t)=> this.genresInclude(t.getGenres() , genres));
    return result;
  }
  

//Dada dos listas de Generos , cheque que los elementos de la primera coincida con alguna de la segunda
  genresInclude(trackGenres , genres){ 
    let res=false; 
  for(let i=0;i<trackGenres.length;i++){  
    if(genres.includes(trackGenres[i])){
      res = true;
    }
  } 
  return res;
} 
  
  collecTracks(listAlbums){
    let resultadoTracks = listAlbums.map((fAlbum) => fAlbum.tracks);
    let flatResultado = resultadoTracks.reduce(function(a, b) { 
        return a.concat(b);         
    });
    return flatResultado;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpretados por el artista con nombre artistName
  getTracksMatchingArtist(artistName) {
    let artistTrack = this.getArtistById(artistName.getId());
    let res = this.collecTracks(artistTrack.getAlbums());
    return res;    
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

  let playListRes = new Playlist(name , genresToInclude, maxDuration); 
  let tracks = this.tracksForPlaylist(genresToInclude , maxDuration);
  playListRes.setTracks(tracks);
  return playListRes;
  }

  
  // Crea una lista de tracks , dada una lista de generos y una duracion estimativa.   
  tracksForPlaylist(genres , duration){
  let tracks = this.getTracksMatchingGenres(genres);
  let res = [];
  for(let i=0;this.sumarTiempoDeTracks(res)<duration && i<tracks.length;i++){ 
      
  //Tenemos que evitar el random ya que no da siempre lo mismo y elije tracks que ya estan en la lista y no deberia tener repetidos antes de agregar
  res[i]=tracks[Math.floor(Math.random() * tracks.length)];
  }
  return res;
}


  //Devuelve la suma de la duracion de la lista de tracks que recibe.
  sumarTiempoDeTracks(tracks){  
  let mapTime = tracks.map((t)=> t.duration); 
  return mapTime.reduce((number , initialValue)=>initialValue + number , 0);
  
} 

  //Dado un string retorna todos los elementos que tengan ese string en el nombre
  searchByName(string){
  
  let res = {artists:[], albums:[] , tracks:[] , playlists:[]}   
  
  res.artists = this.artists.filter((a)=>a.getName().includes(string));
  res.albums = this.collectAlbums().filter((a)=>a.getName().includes(string)); 
  res.tracks = this.collecTracks(this.collectAlbums()).filter((t)=>t.getName().includes(string));
  // Si no me equivoco esto falla porque no se crea bien la lista. Los anteriores a esta linea agregan correctamente (chequeado con console.log)
  res.playlists = this.playlists.filter((p)=>p.getName().includes(string));
  return res;
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

