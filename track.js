class Track{
    constructor(_id, _name, _duration, _genres=[]){
        this.id = _id;
        this.name = _name;
        this.duration = _duration;
        this.genres = _genres;
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

    setGenres(genres){
        this.genres = genres;
    }

    hasAnyGenre(genres){
        return genres.filter((g)=> this.genres.includes(g)).length > 0;
    }
}

module.exports = Track;