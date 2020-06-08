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
		retryDelay: 5000,
		apiKey: "nokey",
		league_ids: 4302,
		numberOfGames: 5,
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		Log.info("Starting module: " + this.name);
		var self = this;
		var dataRequest = null;
		

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {1
		var self = this;

		var urlApi = "https://api.pandascore.co/lol/matches/upcoming?filter[league_id]=" + this.config.league_ids + "&page=1&per_page=" + this.config.numberOfGames + "&sort=scheduled_at&token=" + this.config.apiKey;
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;
		

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		// If this.dataRequest is not empty
		if (this.dataRequest) {
			var wrapperDataRequest = document.createElement("table");
			wrapperDataRequest.classList.add("leaguetable")
			// check format https://jsonplaceholder.typicode.com/posts/1
			wrapperDataRequest.innerHTML = this.dataRequest.title;
			wrapperDataRequest.appendChild(this.getHeaderRow());
			serieses = Object.keys(dataRequest).length;
			for (var i = 0; i < serieses; i++){
				wrapperDataRequest.appendChild(this.getDataRow(obj[i].scheduled_at, obj[i].league.name, obj[i].opponents[0].opponent.name, obj[i].opponents[1].opponent.name))
			}
		}else{
			wrapper.innerHTML = "Loading...";
		}
		return wrapper;
	},

	getScripts: function() {
		return [];
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

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;
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
