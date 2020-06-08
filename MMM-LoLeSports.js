

Module.register("MMM-LoLeSports",{

    getDom: function() {
		let wrapper = document.createElement("table");
		wrapper.id = "LOLESPORT-Table";


		let header = document.createElement("tr");
		header.classList.add("tableheader");

		let dataCell = document.createElement("th");
		dataCell.classList.add("headcell");
		dataCell.innerHTML = "League";
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("headcell");
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("headcell");
		dataCell.innerHTML = "Team 1";
		header.appendChild(dataCell);

		dataCell = document.createElement("th");
		dataCell.classList.add("headcell");
		dataCell.innerHTML = "Team 2 ";
		header .appendChild(dataCell);
		wrapper.appendChild(header);


		let testRow = document.createElement("tr");

		dataCell = document.createElement("td");
		dataCell.classList.add("league");
		dataCell.innerHTML = "LEC";
		testRow.appendChild(dataCell);

		dataCell = document.createElement("td");
		dataCell.classList.add("team1");
		dataCell.innerHTML = "Fanatic";
		testRow.appendChild(dataCell);

		testRow.appendChild(this.getVersusCell())

		dataCell = document.createElement("td");
		dataCell.classList.add("team2");
		dataCell.innerHTML ="G2 Esports";
		testRow.appendChild(dataCell);
		wrapper.appendChild(testRow);

		return wrapper;
	},

	getVersusCell: function(){
		let versusCell = document.createElement("td");
		versusCell.classList.add("versuscell");
		versusCell.innerHTML = "VS"
		return versusCell;
	},

	getStyles: function(){
		return ['MMM-LoLeSports.css'];
	},

	start: function() {
		Log.info("Starting module: " + this.name);
	},
})