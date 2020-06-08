/* Magic Mirror
 * Node Helper: MMM-LoLeSports
 *
 * By Martin Gaiser
 * MIT Licensed.
 */

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
			self.getData(config.apiKey, config.numberOfGames, config.league_ids, config.updateInterval);
		}
	},

	getData: function(apiKey, xPerPage, league_ids, updateDelay) {
		var urlApi = "https://api.pandascore.co/lol/matches/upcoming?filter[league_id]=" + league_ids + "&sort=scheduled_at";
		var retry = true;
		var self = this;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.setRequestHeader("Authorization","Bearer "+ apiKey)
		dataRequest.setRequestHeader("X-Page", 1);
		dataRequest.setRequestHeader("X-Per-Page", xPerPage); //TODO number of games variable
		dataRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.sendUnauthorizedNotification("TODO")
					Log.error(self.name, this.status);
					retry = false;
				} else {
					self.sendErrorNotification("TODO");
				}
				if (!error){
					//TODO find a way to get retry delay as variable
					setTimeout(function(){
						getData(apiKey, xPerPage, league_ids, updateDelay);
					}, updateDelay);
				}
			}
		};
		dataRequest.send();
	},

	processData: function(jsonObj){
		//TODO get relevant informations from data and forward it to main-module.
		this.sendLeagueDataNotification("Matches");
	},	

	// Example function send notification test
	sendUnauthorizedNotification: function(payload) {
		this.sendSocketNotification("MMM-LoLeSports-Unauthorized", payload);
	},

	sendErrorNotification: function(payload) {
		this.sendSocketNotification("MMM-LoLeSports-Error",payload);
	},

	sendLeagueDataNotification: function(payload) {
		this.sendLeagueDataNotification("MMM-LoLeSports-GameData", payload);
	},
});
