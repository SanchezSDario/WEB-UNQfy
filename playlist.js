class Playlist{
    constructor(_name, _genres, _duration){
        this.name = _name;
        this.genres = _genres;
        this.duration = _duration;
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

    // Retorna los generos de la playlist
    getGenres(){
        return this.genres;
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
}

module.exports = Playlist;