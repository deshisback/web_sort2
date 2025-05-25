let forms = document.querySelectorAll("form")

let filterForm = forms[2]
let filterInputs = filterForm.querySelectorAll("input")
let filterButton = filterInputs[6]

let dataFilter = (filterForm) => {
    
    let dictFilter = [];
    
    for(let j = 0; j < filterForm.elements.length; j++) {

        let item = filterForm.elements[j];
        
        let valInput = item.value;

        if (item.type == "text") valInput = valInput.toLowerCase()

        if (item.type == "number" && !isNaN(parseFloat(valInput)) && isFinite(valInput)) valInput = parseFloat(valInput)

       if (item.type == "number" && valInput == "") valInput = -1

        dictFilter.push(valInput);
    }

    return dictFilter;
}

let filterTable = (data, headers, idTable, filterForm) =>{

    let datafilter = dataFilter(filterForm);

    let tableFilter = data.filter(item => {

        let result = true;
        
        for(let i = 0; i < item.length; i++) {

            elem = item[i]

            filter = datafilter[i]

            if (!isNaN(parseFloat(elem))) elem = parseFloat(elem)
            
            // текстовые поля проверяем на вхождение
            if (result && typeof elem == 'string') {
                elem = elem.toLowerCase()
                result &&= elem.indexOf(filter) !== -1
            }

            else if (result && (i == 2 || i == 5)){
                if (filter !== -1) result &&= elem === filter
            }

            else result = false

         }
         return result;
    });

    console.log(tableFilter)
    console.log(headers)

    clearTable(idTable)

    createTable(tableFilter, headers, idTable);
}

filterButton.addEventListener("click", () => {
    filterTable(buildings, heads, "list", filterForm)
})