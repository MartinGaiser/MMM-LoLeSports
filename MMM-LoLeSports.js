

Module.register("MMM-LoLeSports",{

    getDom: function() {
		let wrapper = document.createElement("table");
		wrapper.id = "LOLESPORT-Table";
		wrapper.classList.add("leaguetable");

		wrapper.appendChild(this.getHeaderRow())
		
		wrapper.appendChild(this.getDataRow("10.10.2020", "LEC", "G2 Esports", "Fnatic"));

		return wrapper;
	},

	getHeaderRow: function(){
		let header = document.createElement("tr");

		let dataCell = document.createElement("th");
		dataCell.classList.add("dateheader", "th");
		
		dataCell.classList.add("leagueheader", "th");
		let dateIcon = document.createElement('i');
        dateIcon.classList.add('fa', 'fa-calendar');
		dateCell.appendChild(dateIcon);
		header.appendChild(dateCell);

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
		wrapper.appendChild(header);
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

		let dateCell = document.createElement("td")
		dataCell.classList.add("datecell","td");
		dateCell.innerHTML = date;
		testRow.appendChild(dateCell);

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
		wrapper.appendChild(testRow);

		return testRow;
	},

	getStyles: function(){
		return ['MMM-LoLeSports.css','font-awesome.css'];
	},

	start: function() {
		Log.info("Starting module: " + this.name);
	},
})