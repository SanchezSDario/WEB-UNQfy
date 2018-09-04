class Track{
    constructor(_idTrack, _name, _duration, _genres){
        this.idTrack = _idTrack;
        this.name = _name;
        this.duration = _duration;
        this.genres = _genres;
    }

    getId(){
        return this.idTrack;
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

    setId(id){
        this.idTrack = id;
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
}