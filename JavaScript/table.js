let createTable = (data, headers, idTable) => {
	let table = document.getElementById(idTable);
	
	let tr = document.createElement('tr');

	for(let i = 0; i < headers.length; i++) {
		let th = document.createElement('th');
		th.innerHTML = headers[i];
		tr.append(th);
	}

	table.append(tr);
	
	data.forEach((item) => {
        let tr = document.createElement("tr")
        for (let i = 0; i < item.length; i++){
            let td = document.createElement("td")
            td.textContent = item[i]
            tr.append(td)
        }
        table.append(tr)
	});	
}

let clearTable = (idTable) => {
	let table = document.getElementById(idTable)

	table.innerHTML = ""
}