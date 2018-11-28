//const picklify = require('picklify'); // para cargar/guarfar unqfy
//const fs = require('fs'); // para cargar/guarfar unqfy
//const rp = require('request-promise'); //para manejar api request como promesas
const fs = require('fs');
const promisify = require('util').promisify;
const {google} = require('googleapis');
const getGmailClient = require('./gmailClient');


// Obtiene un objeto JJJJJ a partir del credentials.json y token.json
const gmailClient = getGmailClient();


class ArtistSubs{

	/*
		DISCLAIMER: LOS ARTISTAS TIENEN LA ESTRUCTURA DEL TOJSON DEL MISMO, NO DEL OBJETO
	*/

	constructor(_artist){
		this.artist = _artist;
		this.subs = [];
	}

	getArtist(){
		return this.artist;
	}

	getSubs(){
		return this.subs;
	}

	hasSub(subscriptor){
		return this.subs.includes(subscriptor);
	}

	addSub(subscriptor){
		if(! this.hasSub(subscriptor)) this.subs.push(subscriptor);
	}

	removeSub(subscriptor){
		if(this.hasSub(subscriptor)) this.subs.splice(this.subs.indexOf(subscriptor), 1)
	}

	deleteSubs(){
		this.subs = [];
	}

	notifySubs(subject, message){
		for(const sub of this.subs){
			gmailClient.users.messages.send(
				{
					userId: 'me',
					requestBody: {
						raw: this.sendMail(sub, subject, message),
					},
				}
			);
		}
	}

	sendMail(subscriptor, subject, mensaje){
		const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    	const messageParts = [
    		`To: ${subscriptor}`,
      		'Content-Type: text/html; charset=utf-8',
      		'MIME-Version: 1.0',
      		`Subject: ${utf8Subject}`,
      		'',
      		mensaje,
    	];
    	const message = messageParts.join('\n');
  
    	// The body needs to be base64url encoded.
    	const encodedMessage = Buffer.from(message)
      	.toString('base64')
      	.replace(/\+/g, '-')
      	.replace(/\//g, '_')
      	.replace(/=+$/, ''); 
    	return encodedMessage;
	}
}

module.exports = ArtistSubs;