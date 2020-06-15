/* global Module */

/* Magic Mirror
 * Module: MMM-eSports
 *
 * By Martin Gaiser
 * MIT Licensed.
 */

Module.register("MMM-eSports", {
	defaults: {
		updateInterval: 350000,
		apiKey: "nokey",
		leagueIDs: "4302",
		numberOfGames: 10,
		timeFormat: 12,
		language: "en",
		leagueAsImage: false,
		teamAsImage: false,
		showHeader: false,
		showTimestamp:false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		Log.info("Starting module: " + this.name);
		this.leagueData = null;
		this.error = false;
		this.unauthorized = false;
		this.errorRetry = 0;
	},

	getDom: function() {
		if (this.error){
			var wrapper = document.createElement("div");
			this.errorRetry = this.errorRetry-1;
			wrapper.innerHTML = this.translate("UNKNOWN-ERROR") + this.errorRetry + "s";
			return wrapper;
		}

		if (this.unauthorized){
			var wrapper = document.createElement("div");
			wrapper.innerHTML = this.translate("UNAUTHORIZED");
			return wrapper;
		}

		// If this.leagueData is empty, assume module just started. Tell Backend to start fetching Data
		if (this.leagueData == null) {
			var wrapper = document.createElement("div");
			wrapper.innerHTML = this.translate("LOADING");
			this.sendSocketNotification("MMM-eSports-StartFetching", this.config)
			return wrapper;
		//If this.leagueData is not empty, display the data
		}else{
			var wrapper = document.createElement("div");
			var table = document.createElement("table");
			wrapper.appendChild(table);
			table.classList.add("leaguetable");
			if (this.config.showHeader){
				table.appendChild(this.getHeaderRow());
			}
			for (let i = 0; i < this.leagueData.length; i++){
				table.appendChild(this.getDataRow(this.leagueData[i].scheduledAt, this.leagueData[i].leagueName, this.leagueData[i].leagueImage,
					 this.leagueData[i].team1,this.leagueData[i].team1Url, this.leagueData[i].team2, this.leagueData[i].team2Url))
			}
			if (this.config.showTimestamp){
				wrapper.appendChild(this.getTimeStamp());
			}
			return wrapper;
		}
	},

	socketNotificationReceived: function(notification, payload){
		if (notification == "MMM-eSports-Unauthorized"){
			clearInterval();
			this.unauthorized = true;
			this.updateDom();
		}
		if (notification == "MMM-eSports-Error"){
			var IsInErrorState = this.error;
			this.error = true;
			this.errorRetry = payload/1000; // format to seconds
			if (!IsInErrorState){
				Log.log("Starting Interval");
				setInterval(function(){
					self.updateDom();
				}, 1000); //Update Fronent each second and to count down retry timer
			}
		}
		if (notification == "MMM-eSports-GameData"){
			clearInterval();
			this.leagueData = payload;
			this.unauthorized = false;
			this.error = false;
			this.errorRetry = 0;
			this.updateDom();	//Update Dom
		}
	},

	getScripts: function () {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			"MMM-eSports.css",
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

	getTimeStamp: function(){
		let table = document.createElement("table");
		let timestmap = document.createElement("div");
		timestmap.classList.add("small", "dimmed");
		timestmap.innerHTML = moment().calendar();
		table.appendChild(document.createElement("tr").appendChild(document.createElement("td").appendChild(timestmap)));
		return table;		
	},

	getHeaderRow: function(){
		let header = document.createElement("tr");

		let dataCell = document.createElement("th");
		dataCell.classList.add("dateheader", "th");

		dataCell.classList.add("leagueheader", "th");
		let dateIcon = document.createElement("i");
		dateIcon.classList.add("fa", "fa-calendar");
		dataCell.appendChild(dateIcon);
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("leagueheader", "th");
		dataCell.innerHTML = this.translate("LEAGUE");
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
		dataCell.innerHTML = "Team 2";
		header .appendChild(dataCell);
		return header;
	},

	getDataRow: function(date, league, leagueImageURL, team1,team1Url, team2, team2Url){
		let row = document.createElement("tr");

		row.appendChild(this.getDateCell(date));

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

	getDateCell: function(date){
		let dataCell = document.createElement("td")
		dataCell.classList.add("dateCell","td");
		dataCell.innerHTML = date;
		return dataCell;
	},

	getVersusCell: function(){
		let versusCell = document.createElement("td");
		versusCell.classList.add("versuscell", "td");
		versusCell.innerHTML = "VS"
		return versusCell;
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
		dataCell.classList.add("teamText");
		dataCell.innerHTML = teamText;
		return dataCell;
	}
});
