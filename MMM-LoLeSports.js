Module.register("lolesports",{

    getDom: function() {
		var wrapper = document.createElement("table");
		wrapper.id = "Wrapper";
		var header = document.createElement("tr");
		header.appendChild(document.createElement("th").innerHTML("League"));
		header.appendChild(document.createElement("th").innerHTML("Team 1"));
		header.appendChild(document.createElement("th").innerHTML("Team 2"));
		wrapper.appendChild(header);

		var testRow = document.createElement("tr");
		header.appendChild(document.createElement("td").innerHTML("LEC"));
		header.appendChild(document.createElement("td").innerHTML("Fanatic"));
		header.appendChild(document.createElement("td").innerHTML("G2 Esports"));
		wrapper.appendChild(testRow);

		return wrapper;
	}
})