/* Magic Mirror
 * Node Helper: MMM-eSports
 *
 * By Martin Gaiser
 * MIT Licensed.
 */
var request = require("request");
var NodeHelper = require("node_helper");
var moment = require("moment");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		if (notification === "MMM-eSports-StartFetching") {
			console.log("Starting to Fetch League Matches");
			let config = payload;
			moment.updateLocale(config.language, this.getLocaleSpecification(config.timeFormat));
			//Start Interval Fething of Data
			this.getData(config.apiKey, config.numberOfGames, config.leagueIDs, config.updateInterval*1000, 2000);
		}
	},

	getData: function(apiKey, xPerPage, leagueIDs, updateDelay, backoff) {
		console.log("Fetching new Data from Pandascore");
		let urlApi = "https://api.pandascore.co/lol/matches/upcoming";
		urlApi = urlApi.concat("?filter[league_id]=" + leagueIDs);
		urlApi = urlApi.concat("&sort=scheduled_at");
		urlApi = urlApi.concat("&page=1");
		urlApi = urlApi.concat("&per_page=" + xPerPage);
		const options = {
			url: urlApi,
			headers: {
			  "Authorization": "Bearer " + apiKey,
			}
		};

		var self = this;


		const callback = function(error, response, body){
			if (!error && response.statusCode == 200) {
				self.sendLeagueDataNotification(JSON.parse(body)); //send Data to Frontend
				self.retryTimeout = self.defaultRetryTimeout; //reset retry timeout after successful request
				setTimeout(function(){	//start Timeout for new request
					self.getData(apiKey, xPerPage, leagueIDs, updateDelay);
				}, updateDelay);
			}else if (!error && response.statusCode == 401){
				self.sendUnauthorizedNotification(); // send unauthorized message to frontned and stop loop
			}else{
				console.log("MMM-eSports: StatusCode == " + response.statusCode);
				self.sendErrorNotification(backoff); //send error message to frontend
				setTimeout(function(){ //set retry Timeout
					self.getData(apiKey, xPerPage, leagueIDs, updateDelay, backoff*2);
				}, backoff);
			}
		}
		request(options, callback);
	},

	// Example function send notification test
	sendUnauthorizedNotification: function(payload) {
		this.sendSocketNotification("MMM-eSports-Unauthorized", payload);
	},

	sendErrorNotification: function(payload) {
		this.sendSocketNotification("MMM-eSports-Error",payload);
	},

	sendLeagueDataNotification: function(payload) {
		let numberOfMatches = Object.keys(payload).length;
		let matches = [];
		let match = null;
		for (i = 0; i < numberOfMatches-1; i++){
			let leagueName = payload[i].league.name;
			let scheduledAt = payload[i].scheduled_at;
			let team1 = payload[i].opponents[0].opponent.acronym;
			let team2 = payload[i].opponents[1].opponent.acronym;
			let team1Url = payload[i].opponents[0].opponent.image_url;
			let team2Url = payload[i].opponents[1].opponent.image_url;
			let leagueImage = payload[i].league.image_url;
			let myMoment = moment(scheduledAt);
			if (moment(scheduledAt).diff(moment(), 'days', true) <= 1){
				scheduledAt = myMoment.fromNow();
			}else{
				scheduledAt = myMoment.calendar();
			}
			
			match = {
				"leagueName": leagueName,
				"scheduledAt": scheduledAt,
				"team1": team1,
				"team2": team2,
				"leagueImage": leagueImage,
				"team1Url": team1Url,
				"team2Url": team2Url
			}
			matches.push(match);
		}
		this.sendSocketNotification("MMM-eSports-GameData", matches);
	},

	getLocaleSpecification: function(timeFormat) {
		switch (timeFormat) {
		case 12: {
			return { longDateFormat: {LT: "h:mm A"} };
		}
		case 24: {
			return { longDateFormat: {LT: "HH:mm"} };
		}
		default: {
			return { longDateFormat: {LT: moment.localeData().longDateFormat("LT")} };
		}
		}
	},

});
