class Album{
    constructor(_idAlbum, _name, _year, _tracks, _genres, _composers){
        this.idAlbum = _idAlbum;
        this.name = _name;
        this.year = _year;
        this.tracks = _tracks;
        this.genres = _genres;
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

    getGenres(){
        return this.genres;
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

    setGenres(genres){
        this.genres = genres;
    }

    setComposers(composers){
        this.composers = composers;
    }
}