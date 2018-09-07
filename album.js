const Track = require('./track.js');

class Album{
    constructor(_id, _name, _year){
        this.id = _id;
        this.name = _name;
        this.year = _year;
        this.tracks = [];
        this.composers = [];
    }

    getId(){
        return this.id;
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
        this.id = id;
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