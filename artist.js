class Artist{
    constructor(_idArtist, _name, _country, _albums){
        this.idArtist = _idArtist;
        this.name = _name;
        this.country = _country;
        this.albums = _albums;
    }

    getId(){ 
        return this.idArtist;
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
        this.idArtist = id;
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
}

module.exports = Artist;