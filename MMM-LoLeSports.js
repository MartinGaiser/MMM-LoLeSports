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
		var data = null;
		var error = false;
		var unauthorized = false;
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		if (this.error){
			wrapper.innerHTML = "Unknown Error ... check logs.";
			return wrapper;
		}

		if (this.unauthorized){
			wrapper.innerHTML = "Unauthorized ...check API-Token";
			return wrapper;
		}

		// If this.dataRequest is not empty
		if (!this.data) {
			wrapper.innerHTML = "Loading...";
			this.sendSocketNotification("MMM-LoLeSports-StartFetching", this.config)
			return wrapper;
		}else{
			var wrapperDataRequest = document.createElement("table");
			wrapperDataRequest.classList.add("leaguetable")
			wrapperDataRequest.innerHTML = this.dataRequest.title;
			wrapperDataRequest.appendChild(this.getHeaderRow());
			serieses = Object.keys(dataRequest).length;
			for (var i = 0; i < serieses; i++){
				wrapperDataRequest.appendChild(this.getDataRow(obj[i].scheduled_at, obj[i].league.name, obj[i].opponents[0].opponent.name, obj[i].opponents[1].opponent.name))
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
			this.data = payload;
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
