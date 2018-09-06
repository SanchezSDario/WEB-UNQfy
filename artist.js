class Artist{
    constructor(_idArtist, _name, _country, _albums, _genres){
        this.idArtist = _idArtist;
        this.name = _name;
        this.country = _country;
        this.albums = _albums;
        this.genres = _genres;
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

    getGenres(){
        return this.genres;
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

    setGenres(genres){
        this.genres = genres;
    }
}

module.exports = Artist;