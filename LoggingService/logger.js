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

	getStatus(){
		let active = this.active
		return new Promise(function (resolve, reject){
			resolve(active);
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
      	portfinder.basePort = 5000;
      	portfinder.highestPort = 5000;

		return portfinder.getPortPromise();
    }

    getStatusOfNotifier(){
    	portfinder.basePort = 5001;
      	portfinder.highestPort = 5001;

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
    }
}

module.exports = Logger;