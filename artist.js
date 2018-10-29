const Album = require('./album.js');
const ResourceAlreadyExistsError = require('./apiErrors.js').ResourceAlreadyExistsError;

class Artist{
    constructor(_id, _name, _country){
        this.id = _id;
        this.name = _name;
        this.country = _country;
        this.albums = [];
    }

    getId(){ 
        return this.id;
    }

    getName(){ 
        return this.name;
    }

    getCountry(){ 
        return this.country;
    }

    getAlbums(){ 
        return this.albums;
    }

    setId(id){
        this.id = id;
    }

    setName(name){
        this.name = name;
    }

    setCountry(country){
        this.country = country;
    }

    setAlbums(albums){
        this.albums = albums;
    }

    // Retorna los generos del artista, que son todos los generos de sus albums
    //getGenres(){}

    // Agrega un album al artista, si el id del album ya estaba en el sistema lanza una excepcion
    // de lo contrario crea un album, lo agrega al artista y lo retorna
    addAlbum(albumId, albumData){
        if(!(this.hasAlbumById(albumId) || this.hasAlbumByName(albumData.name))){
            let album = new Album(albumId, albumData.name, albumData.year);
            this.albums.push(album);
            return album;
        }
        else throw new ResourceAlreadyExistsError;
    }

    // Chequea la existencia de un album en el artista
    hasAlbumById(id){
       return this.albums.map((a)=>a.id).includes(id);
    }

    // Chequea la existencia de un album en el artista
    hasAlbumByName(name){
        return this.albums.map((a)=>a.name).includes(name);
     }
    
    toJSON(){
        let data = {
            id : this.id,
            name : this.name,
            country : this.country,
            albums : this.albums
        };
        return data;
    }
}

module.exports = Artist;
