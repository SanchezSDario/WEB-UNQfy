const rp = require('request-promise');

class Track{
    constructor(_id, _name, _duration, _genres=[]){
        this.id = _id;
        this.name = _name;
        this.duration = _duration;
        this.genres = _genres;
        this.lyrics;
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

    getLyrics(){
        if(this.lyrics !== undefined){
            console.log("Ya hay lyrics!:");
            console.log("------------------");
            console.log(this.lyrics);
            return new Promise(() => this.lyrics);
        }
        else{
            console.log("No hay lyrics! obteniendo datos de MusixMatch...")
            const BASE_URL = 'https://api.musixmatch.com/ws/1.1/';
            var trackIdPromise = this.getTrackIdByNameFromMusixMatch(BASE_URL);
            return this.getLyricsOfTrackByIdFromMusixMatch(BASE_URL, trackIdPromise);
        }
    }

    getTrackIdByNameFromMusixMatch(baseUrl){
        console.log("Obteniendo cancion mediante su titulo...")
        const options = {
            uri: baseUrl + 'track.search?q_track='+this.name,
            qs: {
                apikey: 'ba8781ab22ae634e04c736ac147c2f54',
            },
            json: true
        };

        return rp.get(options).then((response) =>{
            console.log("Obtenido track mediante el titulo " + response.message.body.track_list[0].track.track_name);
            console.log(response.message.body.track_list[0].track.track_id);
            return response.message.body.track_list[0].track.track_id;
        }).catch((error) => console.log(error));
    }

    //FIXME: Retornar string vacio caundo no hay lyrics o manejar error
    getLyricsOfTrackByIdFromMusixMatch(baseUrl, promise){
        return promise.then((response) =>{
            console.log("Se obtendran los lyrics del track con id " + response);
            const options = {
                uri: baseUrl + 'track.lyrics.get?track_id='+response,
                qs: {
                    apikey: 'ba8781ab22ae634e04c736ac147c2f54',
                },
                json: true
            };
            return rp.get(options).then((resp) => {
                console.log("Obteniendo lyrics del track en cuestion...");
                this.lyrics = resp.message.body.lyrics.lyrics_body;
                console.log("Lyrics guardados con exito! intente obtenerlos nuevamente para verlos");
                }).catch((error) => console.log(error));
            }
        );
    }

    toJSON(){
        let data = {
            id : this.id,
            name : this.name,
            duration : this.duration,
            genres : this.genres,
            lyrics : this.lyrics
        };
        return data;
    }
}

module.exports = Track;