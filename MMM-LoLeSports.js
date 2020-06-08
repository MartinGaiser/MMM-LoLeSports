

Module.register("MMM-LoLeSports",{

    getDom: function() {
		let wrapper = document.createElement("table");
		wrapper.id = "LOLESPORT-Table";
		wrapper.classList.add("leaguetable");


		let header = document.createElement("tr");

		let dataCell = document.createElement("th");
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


		let testRow = document.createElement("tr");

		dataCell = document.createElement("td");
		dataCell.classList.add("league","td");
		dataCell.innerHTML = "LEC";
		testRow.appendChild(dataCell);

		dataCell = document.createElement("td");
		dataCell.classList.add("team1","td");
		dataCell.innerHTML = "Fanatic";
		testRow.appendChild(dataCell);

		testRow.appendChild(this.getVersusCell())

		dataCell = document.createElement("td");
		dataCell.classList.add("team2","td");
		dataCell.innerHTML ="G2 Esports";
		testRow.appendChild(dataCell);
		wrapper.appendChild(testRow);

		return wrapper;
	},

	getVersusCell: function(){
		let versusCell = document.createElement("td");
		versusCell.classList.add("versuscell", "td");
		versusCell.innerHTML = "VS"
		return versusCell;
	},

	getStyles: function(){
		return ['MMM-LoLeSports.css','font-awesome.css'];
	},

	start: function() {
		Log.info("Starting module: " + this.name);
	},
})