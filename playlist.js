class Playlist{
    constructor(_name, _duration, _genres, _tracks){
        this.name = _name;
        this.duration = _duration;
        this.genres = _genres;
        this.tracks = _tracks;
    }

    getName(){
        return this.name;
    }

    getDuration(){
        return this.duration;
    }

    getGenres(){
        return this.genres;
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

    setGenres(genres){
        this.genres = genres;
    }

    setTracks(tracks){
        this.tracks = tracks;
    }
}