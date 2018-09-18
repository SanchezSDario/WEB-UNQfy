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

    // Agrega un track al album, si el id del track ya estaba en el album lanza una excepcion,
    // de lo contrario crea un track, lo agrega al album y lo retorna
    addTrack(trackId, trackData){
        if(! this.hasTrack(trackId)){
            let track = new Track(trackId, trackData.name, trackData.duration, trackData.genres);
            this.tracks.push(track);
            return track;
        }
        else{
            throw new Error("El track ya esta en el album");
        }
    }

    // Chequea la existencia de un track en el album mediante su id
    hasTrack(id){
        return this.tracks.map((t)=>t.id).includes(id);
    }
}

module.exports = Album;
