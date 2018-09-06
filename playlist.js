class Playlist{
    constructor(_name, _duration, _tracks){
        this.name = _name;
        this.duration = _duration;
        this.tracks = _tracks;
    }

    getName(){
        return this.name;
    }

    getDuration(){
        return this.duration;
    }

    getTracks(){
        return this.tracks;
    }

    setName(name){
        this.name = name;
    }

    setDuration(duration){
        this.duration = duration;
    }

    setTracks(tracks){
        this.tracks = tracks;
    }

    // Retorna los generos de la playlist, que son todos los generos de sus tracks
    //getGenres(){}
}

module.exports = Playlist;