/* Magic Mirror
 * Node Helper: MMM-LoLeSports
 *
 * By Martin Gaiser
 * MIT Licensed.
 */
var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		if (notification === "MMM-LoLeSports-StartFetching") {
			console.log("Starting to Fetch League Matches");
			let config = payload;
			//Start Interval Fething of Data
			this.getData(config.apiKey, config.numberOfGames, config.league_ids, config.updateInterval);
		}
	},

	getData: function(apiKey, xPerPage, league_ids, updateDelay) {

		var urlApi = "https://api.pandascore.co/lol/matches/upcoming?filter[league_id]=" + league_ids + "&sort=scheduled_at";
		const options = {
			url: urlApi,
			headers: {
			  "Authorization": "Bearer " + apiKey,
			  "X-Page":1,
			  "X-PerPage":xPerPage,
			}
		};

		var retry = true;
		var self = this;


		const callback = function(error, response, body){
			if (!error && response.statusCode == 200) {
				self.sendLeagueDataNotification(JSON.parse(body));
			}else if (!error && response.statusCode == 401){
				self.sendUnauthorizedNotification();
				retry = false;
			}else{
				self.sendErrorNotification();
				retry = false;
			}
			if (retry){
				//TODO find a way to get retry delay as variable
				setTimeout(function(){
					self.getData(apiKey, xPerPage, league_ids, updateDelay);
				}, updateDelay);
			}
		}
		   
		request(options, callback);
	},	

	// Example function send notification test
	sendUnauthorizedNotification: function(payload) {
		this.sendSocketNotification("MMM-LoLeSports-Unauthorized", payload);
	},

	sendErrorNotification: function(payload) {
		this.sendSocketNotification("MMM-LoLeSports-Error",payload);
	},

	sendLeagueDataNotification: function(payload) {
		let numberOfMatches = Object.keys(payload).length;
		let matches = [];
		let match = null;
		for (i = 0; i < numberOfMatches-1; i++){
			let leagueName = payload[i].league.name;
			let scheduled_at = payload[i].scheduled_at;
			let team1 = payload[i].opponents[0].opponent.acronym;
			let team2 = payload[i].opponents[1].opponent.acronym;
			match = {
				"leagueName": leagueName,
				"scheduled_at": scheduled_at,
				"team1": team1,
				"team2": team2
			}
			matches.push(match);
		}
		this.sendSocketNotification("MMM-LoLeSports-GameData", matches);
	},
});
