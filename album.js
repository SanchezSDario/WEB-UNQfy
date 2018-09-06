class Album{
    constructor(_idAlbum, _name, _year, _tracks, _composers){
        this.idAlbum = _idAlbum;
        this.name = _name;
        this.year = _year;
        this.tracks = _tracks;
        this.composers = _composers;
    }

    getId(){
        return this.idAlbum;
    }

    getName(){
        return this.name;
    }

    getYear(){
        return this.year;
    }

    getTracks(){
        return this.tracks;
    }

    getComposers(){
        return this.composers;
    }

    setId(id){
        this.idAlbum = id;
    }

    setName(name){
        this.name = name;
    }

    setYear(year){
        this.year = year;
    }

    setTracks(tracks){
        this.tracks = tracks;
    }

    setComposers(composers){
        this.composers = composers;
    }

    // Retorna los generos del album, que son todos los generos de sus tracks
    //getGenres(){}

}

module.exports = Album;