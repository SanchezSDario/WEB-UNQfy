
const picklify = require('picklify'); // para cargar/guarfar unqfy
const fs = require('fs'); // para cargar/guarfar unqfy
const rp = require('request-promise'); //para manejar api request como promesas
const promisify = require('util').promisify;
const Artist = require('./artist.js');
const Album = require('./album.js');
const Track = require('./track.js');
const Playlist = require('./playlist.js');
const NotificationObserver = require('./notificationObserver.js');

let ResourceAlreadyExistsError = require('./apiErrors.js').ResourceAlreadyExistsError;
let RelatedResourceNotFoundError = require('./apiErrors.js').RelatedResourceNotFoundError;
let ResourceNotFoundError = require('./apiErrors.js').ResourceNotFoundError;

class UNQfy {

  constructor(){
    this.artists = []
    this.playlists = []
    this.notificationObserver = new NotificationObserver(this);
    this.numId = 0;
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
      this.notificationObserver.update(this);
      return artistToAdd;
    }
    else throw new ResourceAlreadyExistsError;
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
     this.notificationObserver.update(this);
     artistToDelete = null;
  }

  deleteArtistById(artistId){
    let artistToDelete = this.getArtistById(artistId);
    let artistAlbums = artistToDelete.albums;
    let artistTracks = this.collecTracks(artistAlbums);
    artistTracks.forEach((t)=> this.deleteTrackFromPlaylists(t));
    artistAlbums.forEach((a)=> a.tracks.forEach((t)=> this.deleteTrackFromAlbum(a, t.name)));
    artistToDelete.albums.forEach((a)=> this.deleteAlbumFromArtist(artistToDelete, a.name));
    this.artists.splice(this.artists.indexOf(artistToDelete), 1);
    this.notificationObserver.update(this);
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
    try{
        let album = this.getArtistById(artistId).addAlbum(this.generateID(), albumData);
        this.notificationObserver.update(this);
        return album;
      }
    catch(error){
      if(error.statusCode === 409) throw error
      else {throw new RelatedResourceNotFoundError;}
    }
  }
  //Dado un artista y un album, elimina el album de ese artista 
  deleteAlbum(artistName, albumName){
    let artistWithAlbum = this.getArtistByName(artistName);
    let albumToDelete = this.getAlbumInArtist(artistWithAlbum, albumName);
    let tracksFromAlbumToDelete = albumToDelete.tracks;
    tracksFromAlbumToDelete.forEach((t)=> this.deleteTrackFromPlaylists(t));
    albumToDelete.tracks.forEach((t)=> this.deleteTrackFromAlbum(albumToDelete, t.name));
    this.deleteAlbumFromArtist(artistWithAlbum, albumToDelete.name);
    albumToDelete =null;
  }

  deleteAlbumById(albumId){
    let albumName = this.getAlbumById(albumId).name;
    let artistWithAlbum = this.getArtistByAlbumId(albumId);
    let albumToDelete = this.getAlbumInArtist(artistWithAlbum, albumName);
    let tracksFromAlbumToDelete = albumToDelete.tracks;
    tracksFromAlbumToDelete.forEach((t)=> this.deleteTrackFromPlaylists(t));
    albumToDelete.tracks.forEach((t)=> this.deleteTrackFromAlbum(albumToDelete, t.name));
    this.deleteAlbumFromArtist(artistWithAlbum, albumToDelete.name);
    albumToDelete =null;
  }

  getArtistByAlbumId(albumId){
    let album = this.artists.find((artist) => artist.hasAlbumById(albumId));
    return this.returnIfExists(album, "Album");
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

 //Dado un artista retorna los albumes que tiene
 getAlbumsForArtist(artistName){
   return this.getArtistByName(artistName).albums;
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
    if(obj === undefined) throw new ResourceNotFoundError;
    else return obj;
  }

  // Retorna los albumes en el sistema, que son la suma de todos los albumes de todos los artistas
  collectAlbums(){
    let resultadoAlbums = this.artists.map((fArtist) => fArtist.albums);
    let flatResultado = resultadoAlbums.reduce(function(a, b) { 
        return a.concat(b);
    }, new Array);
    return flatResultado;
  }

  // genres: array de generos(strings)
  // retorna: los tracks que contenga alguno de los generos en el parametro genres
  getTracksMatchingGenres(genres) {
    let albums = this.collectAlbums();
    let tracks = this.collecTracks(albums);
 
    let result = tracks.filter((t)=> t.hasAnyGenre(genres));
    return result;
  }
  
  //Dada una lsita de albumes mapea todos a sus tracks y los retorna en lista
  collecTracks(listAlbums){
    let resultadoTracks = listAlbums.map((fAlbum) => fAlbum.getTracks());
    let flatResultado = resultadoTracks.reduce(function(a, b) { 
        return a.concat(b);         
    }, []);
    return flatResultado;
  }

  // artistName: nombre de artista(string)
  // retorna: los tracks interpretados por el artista con nombre artistName
  getTracksMatchingArtist(artist) {
    return this.collecTracks(artist.getAlbums());    
  }

  //Dado un nombre de artista lo busca en el sistema, de encontrarlo lo retorna
  getArtistByName(artistName){
    return this.returnIfExists(this.artists.find((a) => a.name === artistName), "artista " + artistName);
  }

  //Dado un nombre de artista lo busca en el sistema y retorna una lista de posibles resultados
  getArtistsByName(artistName){
    return this.artists.filter((artist) => artist.getName().toLowerCase().includes(artistName.toLowerCase()));
  }

  //Dado un nombre busca albumes que contengan estos caracteres, retorna una lista de albumes que matchearon
  getAlbumsByName(albumName){
    let allAlbums = this.collectAlbums();
    let filtered = allAlbums.filter((album) => album.getName().toLowerCase().includes(albumName.toLowerCase()));
    return filtered;
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

  populateAlbumsForArtist(artistName){
    let addedArtistPromise = this.getArtistByNameFromSpoty(artistName);
    let addedAlbumsPromise = this.getAlbumsOfArtistFromSpoty(addedArtistPromise);
    return addedAlbumsPromise;
  }

  //Busca el artista por nombre en Spoty y se queda con el primer resultado
  getArtistByNameFromSpoty(artistName){
    const options = {
      url: 'https://api.spotify.com/v1/search?q=' + artistName + '&type=artist',
      headers: { Authorization: 'Bearer ' + 'BQDD2MeVPy-ja8j2VBic-VwH8BpX49RhPVisMLdjhI-KuNvfYmjzpCH8W8XdqRHFvUSMBqCQXtf4upPgTbNnzmZ-c8YwwLHlA3PN48GRMwZcXKGtTGQL-32lNAVCHMlX5JmBfitmX0wYwBdquOefvy0ExgkkL8HCD8OL'
               },
      json: true,
    };
    return rp.get(options).then((response) => {
      console.log("Artista encontrado! agregandolo al sistema...");
      let artist = this.addArtist(response.artists.items[0]);
      return ([response.artists.items[0], artist]);
    }).catch(error => console.log(error));
  }

  //Agrega albumes a un artista proveniente de soty y encapsulado en una promesa
  getAlbumsOfArtistFromSpoty(artistPromise){
    return artistPromise.then((arr) => {
      const options = {
        url: 'https://api.spotify.com/v1/artists/'+ arr[0].id +'/albums',
        headers: { Authorization: 'Bearer ' + 'BQDD2MeVPy-ja8j2VBic-VwH8BpX49RhPVisMLdjhI-KuNvfYmjzpCH8W8XdqRHFvUSMBqCQXtf4upPgTbNnzmZ-c8YwwLHlA3PN48GRMwZcXKGtTGQL-32lNAVCHMlX5JmBfitmX0wYwBdquOefvy0ExgkkL8HCD8OL'
                 },
        json: true,
      };
      return rp.get(options).then((response) => {
        console.log("Obteniendo albumes y agregandolos al artisa...");
        response.items.forEach(album => {if(! arr[1].hasAlbumByName(album.name))this.addAlbum(arr[1].id, album)});
        console.log("Operacion completa, aqui esta la informacion completa!");
        console.log(this.getArtistById(arr[1].id));
        return response;
      }).catch(error => console.log(error));
    })
  }

  save(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  saveAsync(filename) {
    const listenersBkp = this.listeners;
    this.listeners = [];

    const serializedData = picklify.picklify(this);

    this.listeners = listenersBkp;
    let writeFile = promisify(fs.writeFile); 
    return writeFile(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, {encoding: 'utf-8'});
    const classes = [UNQfy, Artist, Album, Track, Playlist, NotificationObserver];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }

  toJSON(){
    let data = {
      artists : this.artists,
      playlists : this.playlists,
      numId : this.numId
    };
    return data;
  }
}

// COMPLETAR POR EL ALUMNO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};
