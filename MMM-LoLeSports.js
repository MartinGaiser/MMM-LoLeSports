/* global Module */

/* Magic Mirror
 * Module: MMM-LoLeSports
 *
 * By Martin Gaiser
 * MIT Licensed.
 */

Module.register("MMM-LoLeSports", {
	defaults: {
		updateInterval: 60000,
		apiKey: "nokey",
		league_ids: 4302,
		numberOfGames: 5,
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		Log.info("Starting module: " + this.name);
		var self = this;
		var leagueData = null;
		var error = false;
		var unauthorized = false;
	},

	getDom: function() {
		var self = this;

		if (this.error){
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Unknown Error ... check logs.";
			return wrapper;
		}

		if (this.unauthorized){
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Unauthorized ...check API-Token";
			return wrapper;
		}

		// If this.dataRequest is not empty
		if (this.leagueData == null) {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = "Loading...";
			this.sendSocketNotification("MMM-LoLeSports-StartFetching", this.config)
			return wrapper;
		}else{
			Log.log(this.leagueData);
			var wrapper = document.createElement("table");
			wrapper.classList.add("leaguetable")
			wrapper.appendChild(this.getHeaderRow());
			for (let i = 0; i < this.leagueData.length; i++){
				wrapper.appendChild(this.getDataRow(this.leagueData[i].scheduled_at, this.leagueData[i].leagueName, this.leagueData[i].team1, this.leagueData[i].team2))
			}
			return wrapper;
		}
	},

	socketNotificationReceived: function(notification, payload){
		if (notification == "MMM-LoLeSports-Unauthorized"){
			this.unauthorized = true;
			this.updateDom();
		}
		if (notification == "MMM-LoLeSports-Error"){
			this.error = true;
			this.updateDom();
		}
		if (notification == "MMM-LoLeSports-GameData"){
			this.leagueData = payload;
			this.updateDom();
		}
	},

	getStyles: function () {
		return [
			"MMM-LoLeSports.css",
			"font-awesome.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	getHeaderRow: function(){
		let header = document.createElement("tr");

		let dataCell = document.createElement("th");
		dataCell.classList.add("dateheader", "th");
		
		dataCell.classList.add("leagueheader", "th");
		let dateIcon = document.createElement('i');
        dateIcon.classList.add('fa', 'fa-calendar');
		dataCell.appendChild(dateIcon);
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("leagueheader", "th");
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("team1header", "th");
		dataCell.innerHTML = "Team 1";
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("versusheader","th");
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("team2header","th");
		dataCell.innerHTML = "Team 2 ";
		header .appendChild(dataCell);
		return header;
	},

	getVersusCell: function(){
		let versusCell = document.createElement("td");
		versusCell.classList.add("versuscell", "td");
		versusCell.innerHTML = "VS"
		return versusCell;
	},

	getDataRow: function(date, league, team1, team2){
		let testRow = document.createElement("tr");

		let dataCell = document.createElement("td")
		dataCell.classList.add("datecell","td");
		dataCell.innerHTML = date;
		testRow.appendChild(dataCell);

		dataCell = document.createElement("td");
		dataCell.classList.add("league","td");
		dataCell.innerHTML = league;
		testRow.appendChild(dataCell);

		dataCell = document.createElement("td");
		dataCell.classList.add("team1","td");
		dataCell.innerHTML = team1;
		testRow.appendChild(dataCell);

		testRow.appendChild(this.getVersusCell())

		dataCell = document.createElement("td");
		dataCell.classList.add("team2","td");
		dataCell.innerHTML = team2;
		testRow.appendChild(dataCell);

		return testRow;
	},
});
