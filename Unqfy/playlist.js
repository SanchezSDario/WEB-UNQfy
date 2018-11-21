class Playlist{
    constructor(_id, _name, _genres, _duration){
        this.id = _id;
        this.name = _name;
        this.genres = _genres;
        this.duration = _duration;
        this.tracks = [];
    }
    
    getId(){ 
        return this.id;
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
    
    setId(id){
        this.id = id;
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
    
    hasTrack(track){
        return this.tracks.includes(track);
    }
        
}

module.exports = Playlist;
