const UNQfyModule = require('./unqfy.js');
const UNQfyConstructor = UNQfyModule.UNQfy;
const ArtistConstructor = UNQfyModule.Artist;

let Unqfy = new UNQfyConstructor();

module.exports.help = function(){
    return "That's all";
}








require("make-runnable");