/* global Module */

/* Magic Mirror
 * Module: MMM-LoLeSports
 *
 * By Martin Gaiser
 * MIT Licensed.
 */

Module.register("MMM-LoLeSports", {
	defaults: {
		updateInterval: 350000,
		apiKey: "nokey",
		league_ids: "4302",
		numberOfGames: 7,
		timeFormat: 24,
		language: "de",
		leagueAsImage: false,
		teamAsImage: false
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
				wrapper.appendChild(this.getDataRow(this.leagueData[i].scheduled_at, this.leagueData[i].leagueName, this.leagueData[i].leagueImage,
					 this.leagueData[i].team1,this.leagueData[i].team1Url, this.leagueData[i].team2, this.leagueData[i].team2Url))
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

	getScripts: function () {
		return ["moment.js"];
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

	getDataRow: function(date, league, leagueImageURL, team1,team1Url, team2, team2Url){
		let row = document.createElement("tr");

		
		let dataCell = document.createElement("td")
		dataCell.classList.add("datecell","td");
		dataCell.innerHTML = date;
		row.appendChild(dataCell);

		if(this.config.leagueAsImage){
			row.appendChild(this.getLeagueAsImage(leagueImageURL));
		}else{
			row.appendChild(this.getLeagueAsText(league));
		}

		if(this.config.teamAsImage){
			row.appendChild(this.getTeamAsImage(team1Url));
		}else{
			row.appendChild(this.getTeamAsText(team1));
		}
		row.appendChild(this.getVersusCell());
		if(this.config.teamAsImage){
			row.appendChild(this.getTeamAsImage(team2Url));
		}else{
			row.appendChild(this.getTeamAsText(team2));
		}

		return row;
	},

	getLeagueAsImage: function(iconUrl){
		let dataCell = document.createElement("td");
		dataCell.classList.add("leagueCell", "td");
		let image = document.createElement("img");
		image.classList.add("leagueIcon", "img");
		image.setAttribute("src", iconUrl);
		dataCell.appendChild(image);
		return dataCell;
	},

	getLeagueAsText: function(leagueText){
		let dataCell = document.createElement("td");
		dataCell.classList.add("leagueCell","td");
		dataCell.innerHTML = leagueText;
		return dataCell;

	},

	getTeamAsImage: function(iconUrl){
		let dataCell = document.createElement("td");
		dataCell.classList.add("teamIconCell", "td");
		let image = document.createElement("img");
		image.classList.add("teamIcon", "img");
		image.setAttribute("src", iconUrl);
		dataCell.appendChild(image);
		return dataCell;
	},

	getTeamAsText: function(teamText){
		dataCell = document.createElement("td");
		dataCell.innerHTML = teamText;
		return dataCell;
	}
});
