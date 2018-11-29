const rp = require('request-promise');
const promisify = require('util').promisify;
const portfinder = require('portfinder');

class Logger{

	constructor(){
		this.active = true;
	}

	activate(){
		this.active = true;
	}

	deactivate(){
		this.active = false;
	}

	getStatusOfUNQfy(){
		const options = {
			url: 'http://localhost:8080/api/artists?name',
      		json: true,
      	}

      	portfinder.basePort = 8080;
      	portfinder.highestPort = 8080;

		return portfinder.getPortPromise();
    }

    getStatusOfNotifier(){
		const options = {
			url: 'http://localhost:5000/api/artists?name',
      		json: true,
      	}

    	portfinder.basePort = 5000;
      	portfinder.highestPort = 5000;

		return portfinder.getPortPromise();
    }
}

module.exports = Logger;