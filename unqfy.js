
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

  getPlaylists(){
    return this.playlists;
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
  
  let artistToAdd = new Artist(this.generateID(), artistData.name, artistData.country);

  
    if(!this.hasArtist(artistToAdd)){
            this.artists.push(artistToAdd);
            return artistToAdd;
        } else {
            throw new Error("El artista " + artistToAdd.getName() + " ya esta incluido");
        }
  }     

  hasArtist(artist){
    return this.artists.map((a) => a.getName()).includes(artist.getName());
  }
  

  // Dado el nombre del artista elimina los tracks, albums y lo borra de las playlist tambien.
  deleteArtist(artistName){
     let artistToDelete = this.getArtistByName(artistName);
     let artistAlbums = artistToDelete.albums;
     let artistTracks = this.collecTracks(artistAlbums);
     artistTracks.forEach((t)=> this.deleteTrackFromPlaylists(t));
     artistAlbums.forEach((a)=> a.tracks.forEach((t)=> this.deleteTrackFromAlbum(a, t.name)));
     artistToDelete.albums.forEach((a)=> this.deleteAlbumFromArtist(artistToDelete, a.name));
     this.artists.splice(this.artists.indexOf(artistToDelete), 1);
     artistToDelete = null;
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
  
  //Dado un artista y un album, elimina el album de ese artista 
  deleteAlbum(artistName, albumName){
    let artistWithAlbum = this.getArtistByName(artistName);
    let albumToDelete = this.getAlbumInArtist(artistWithAlbum, albumName);
    let tracksFromAlbumToDelete = albumToDelete.tracks;
    tracksFromAlbumToDelete.forEach((t)=> this.deleteTrackFromPlaylists(t));
    albumToDelete.tracks.forEach((t)=> this.deleteTrackFromAlbum(albumToDelete, t.name));
    this.deleteAlbumFromArtist(artistWithAlbum, albumToDelete);
    albumToDelete =null;
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


//Dado un nombre de artista, uno de album y uno de track elimina este del sistema reflejandose en los tracks de
//un album y en los de las playlist de las que forme parte
 deleteTrack(artistName, albumName, trackName){
   let artistFromTheTrack = this.getArtistByName(artistName);
   let albumFromTheArtist = this.getAlbumInArtist(artistFromTheTrack, albumName);
   let trackToDelete = this.deleteTrackFromAlbum(albumFromTheArtist, trackName);
   this.deleteTrackFromPlaylists(trackToDelete);
   trackToDelete = null;
 }

deleteAlbumFromArtist(artist, albumName){
  let album = this.returnIfExists(artist.albums.find((a)=> a.name === albumName), "album " + albumName);
  artist.albums.splice(artist.albums.indexOf(album), 1);
  return album;
}

 //Dado un album y un nombre de track busca este en el album, de encontrarlo lo elimina del album y lo retorna.
 deleteTrackFromAlbum(album, trackName){
   let track = this.returnIfExists(album.tracks.find((t)=>t.name===trackName), "track " + trackName);
   album.tracks.splice(album.tracks.indexOf(track), 1);
   return track;
 }

 //Dado un artista y un nombre de album busca este en los albumes del artista, de encontrarlo lo retorna.
 getAlbumInArtist(artist, albumName){
   return this.returnIfExists(artist.albums.find((a)=> a.name === albumName), "album " + albumName);
 }

 //Dado un track busca las playlist que lo contengan para asi eliminarlo de las mismas.
 deleteTrackFromPlaylists(track){
   let playlistsWithTrack = this.playlists.filter((pl)=> pl.tracks.includes(track));
   playlistsWithTrack.forEach((pl)=>pl.tracks.splice(pl.tracks.indexOf(track), 1));
 }

  //Retorna un artista mediante el id del mismo, de no estar en el sistema se arroja una exepcion
  getArtistById(id) { 
    let artist = this.artists.find((a)=>a.getId()===id);
    return this.returnIfExists(artist, "artista");
  }

  //Retorna un album mediante el id del mismo, de no estar en el sistema se arroja una exepcion
  getAlbumById(id) {
    let album = this.collectAlbums().find((a)=>a.id===id) ;
    return this.returnIfExists(album, "album");
  }

  //Retorna un track mediante el id del mismo, de no estar en el sistema se arroja una exepcion
  getTrackById(id) {
    let tracks  = this.collecTracks(this.collectAlbums());
    let track = tracks.find((t)=>t.id===id)
    return this.returnIfExists(track , "track") ;
  }

  //Retorna una playlist mediante el id del mismo, de no estar en el sistema se arroja una exepcion
  getPlaylistById(id) {
    let playlist = this.playlists.find((a)=>a.id===id);
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
  //RARO POR DISCRIMINAR EL TIPO... ES POR DIFERENCIA DE REQUERIMIENTO CON LO QUE TIENE EL TEST
  genresInclude(trackGenres , genres){ 
    if(typeof(genres) === "string"){
      return this.genresIncludeAux(trackGenres, genres.split(", "));
    }
    else{
      return this.genresIncludeAux(trackGenres, genres);
    }
  }

  //Dado una lista de generos y un genero retorna si este ultimo forma parte de la lista de generos
  genresIncludeAux(trackGenres, genres){
    let res=false;
    for(let i=0;i<genres.length;i++){
      res = trackGenres.includes(genres[i]);
      if(res){break;}
    }
    return res;
  }
  
  //Dada una lsita de albumes mapea todos a sus tracks y los retorna en lista
  collecTracks(listAlbums){
    let resultadoTracks = listAlbums.map((fAlbum) => fAlbum.getTracks());
    let flatResultado = resultadoTracks.reduce(function(a, b) { 
        return a.concat(b);         
    });
    return flatResultado;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpretados por el artista con nombre artistName
  //RARO POR DISCRIMINAR EL TIPO... ES POR DIFERENCIA DE REQUERIMIENTO CON LO QUE TIENE EL TEST
  getTracksMatchingArtist(artist) {
    let artistTrack
    if(typeof(artist)==="string"){
        
        artistTrack= this.getArtistByName(artist);
        
    } else{
        
        artistTrack= this.getArtistById(artist.getId());
        
    }
    let res = this.collecTracks(artistTrack.getAlbums());
    return res;    
  }


  //Dado un nombre de artista lo busca en el sistema, de encontrarlo lo retorna
  getArtistByName(artistName){
    return this.returnIfExists(this.artists.find((a) => a.name === artistName), "artista " + artistName);
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

  let playListRes = new Playlist(this.generateID(), name , genresToInclude, maxDuration); 
  let tracks = this.tracksForPlaylist(genresToInclude , maxDuration);
  playListRes.setTracks(tracks);
  this.playlists = this.playlists.concat(playListRes);
  return playListRes;
  }

  
  // Crea una lista de tracks , dada una lista de generos y una duracion estimativa.   
  tracksForPlaylist(genres , duration){
  let tracks = this.getTracksMatchingGenres(genres);
  let res = [];
  for(let i=0;this.sumarTiempoDeTracks(res)<duration && i<tracks.length;i++){ 
  res[i]=tracks[i];
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

