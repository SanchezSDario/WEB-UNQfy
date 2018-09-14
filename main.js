

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

module.exports.help = function(){
  console.log("COMMANDS");
  console.log("getArtistById(artistId)");
  console.log("getAlbumtById(AlbumId)");
  console.log("getTrackById(trackId)");
  console.log("getPlaylistById(playlistId)");
  console.log("getArtists");
  console.log("addArtist(artistName, artistCountry)");
  console.log("addAlbum(artistId, albumName, albumYear)");
  console.log("addTrack(albumId, trackName, trackDuration, trackGenres)");
  console.log("getTracksMatchingGenres(genresToMatch)");
  return("That's all");
}

module.exports.getArtistById = function(artistId){
  let unqfy = getUNQfy();
  return unqfy.getArtistById(artistId);
}

module.exports.getAlbumById = function(albumId){
  let unqfy = getUNQfy();
  return unqfy.getAlbumById(albumId);
}

module.exports.getTrackById = function(trackId){
  let unqfy = getUNQfy();
  return unqfy.getTrackById(trackId);
}

module.exports.getPlaylistById = function(playlistId){
  let unqfy = getUNQfy();
  return unqfy.getPlaylistById(playlistId);
}

module.exports.getArtists = function(){
  let unqfy = getUNQfy();
  return unqfy.getArtists();
}

module.exports.addArtist = function(artistName, artistCountry){
  let unqfy = getUNQfy();
  unqfy.addArtist({name:artistName, country:artistCountry});
  saveUNQfy(unqfy);
}

module.exports.addAlbum = function(artistId, albumName, albumYear){
  let unqfy = getUNQfy();
  unqfy.addAlbum(artistId, {name:albumName, year:albumYear});
  saveUNQfy(unqfy);
}

module.exports.addTrack = function(albumId, trackName, trackDuration, trackGenres){
  let unqfy = getUNQfy();
  unqfy.addTrack(albumId, {name:trackName, duration:trackDuration, genres:trackGenres});
  saveUNQfy(unqfy);  
}

//ARREGLAR, MAS INFO EN UNQFY.JS
//TODO
module.exports.getTracksMatchingGenres = function(genresToMatch){
  let unqfy = getUNQfy();
  return unqfy.getTracksMatchingGenres(genresToMatch); 
}

require("make-runnable");