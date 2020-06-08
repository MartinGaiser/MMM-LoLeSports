Module.register("MMM-LoLeSports",{

    getDom: function() {
		let wrapper = document.createElement("table");
		wrapper.id = "LOLESPORT-Table";


		let header = document.createElement("tr");
		header.classList.add("tr");

		let dataCell = document.createElement("th");
		dataCell.classList.add("th");

		dataCell.innerHTML = "League";
		header.appendChild(dataCell);

		dataCell.innerHTML = "Team 1";
		header.appendChild(dataCell);

		dataCell.innerHTML = "Team 2 ";
		header .appendChild(dataCell);
		wrapper.appendChild(header);


		let testRow = document.createElement("tr");
		testRow.classList.add("tr");

		dataCell = document.createElement("td");
		dataCell.classList.add("td");

		dataCell.innerHTML = "LEC";
		testRow.appendChild(dataCell);

		dataCell.innerHTML = "Fanatic";
		testRow.appendChild(dataCell);

		dataCell.innerHTML ="G2 Esports";
		testRow.appendChild(dataCell);
		wrapper.appendChild(testRow);

		return wrapper;
	},

	getStyles: function(){
		return ['MMM-LoLeSports.css'];
	},

	start: function() {
		Log.info("Starting module: " + this.name);
	},
})