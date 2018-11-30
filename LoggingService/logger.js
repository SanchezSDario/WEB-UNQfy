const rp = require('request-promise');
const promisify = require('util').promisify;
const portfinder = require('portfinder');

class Logger{

	constructor(){
		this.active = true;
	}

	activate(){
		return this.activatePromise().then(result => {
			this.active = result;
		})
	}

	deactivate(){
		return this.deactivatePromise().then(result => {
			this.active = result;
		})
	}

	activatePromise(){
		return new Promise(function (resolve, reject){
				resolve(true);
		})
	}

	deactivatePromise(){
		return new Promise(function (resolve, reject){
				resolve(false);
		})
	}

	getStatusOfUNQfy(){
      	portfinder.basePort = 8080;
      	portfinder.highestPort = 8080;

		return portfinder.getPortPromise();
    }

    getStatusOfNotifier(){
    	portfinder.basePort = 5000;
      	portfinder.highestPort = 5000;

		return portfinder.getPortPromise();
    }

    log(texto){
    	if(this.active){
    		const options = {
				method: 'POST',
				uri: 'https://hooks.slack.com/services/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',
     			body: {
     				text: texto
     			},
   				json: true,
   			}

   			return rp(options).then((response) => {
     			console.log("Log enviado!");
      		});
    	}
    	else{
    		return promisify(() =>{});
    	}
    }
}

module.exports = Logger;