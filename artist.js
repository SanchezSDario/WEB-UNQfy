const Album = require('./album.js');

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

    addAlbum(albumId, albumData){
        if(! this.hasAlbum(albumId)){
            let album = new Album(albumId, albumData.name, albumData.year);
            this.albums.push(album);
            return album;
        }
        else{
            throw new Error("El artista ya tiene un album con el id " + str(albumId));
        }
    }

    hasAlbum(id){
       return this.albums.includes(id);
    }
}

module.exports = Artist;