let sortForm = forms[3]
let sortButton = sortForm.children[9]
let selects = sortForm.querySelectorAll("select")

let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

let setSortSelect = (arr, sortSelect) => {
    
    sortSelect.append(createOption('Нет', 0));
    
    for (let i in arr) {
        sortSelect.append(createOption(arr[i], Number(i) + 1));
    }
}

let setSortSelects = (data, dataForm) => { 

    let allSelect = dataForm.getElementsByTagName('select');
    
    for(let j = 0; j < allSelect.length; j++) {
        setSortSelect(heads, allSelect[j]);
        if (j != 0) allSelect[j].setAttribute("disabled", "")
    }
}

let changeNextSelect = (nextSelectId, curSelect) => {
    
    let nextSelect = document.getElementById(nextSelectId);
    
    nextSelect.disabled = false;
    
    nextSelect.innerHTML = curSelect.innerHTML;
    
    if (curSelect.value != 0) {
        nextSelect.remove(curSelect.selectedIndex);
    } else {
        nextSelect.disabled = true;
    }
}

let createSortArr = (data) => {
    let sortArr = [];
    
    let sortSelects = data.getElementsByTagName('select');
    
    for (let i = 0; i < sortSelects.length; i++) {   
        let keySort = sortSelects[i].value;
        if (keySort == 0) {
            break;
        }
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push(
          {column: keySort - 1, 
           order: desc}
        ); 
    }
    return sortArr; 
};

let sortTable = (idTable, data) => {

    let sortArr = createSortArr(data);

    if (sortArr.length === 0) {
        return false;
    }

    let table = document.getElementById(idTable);

    let rowData = Array.from(table.rows);
    
    let headers = rowData.shift();
    
    rowData.sort((first, second) => {
        for(let i in sortArr) {
            let key = sortArr[i].column;
            let desc = sortArr[i].order;

            if (first.cells[key].innerHTML > second.cells[key].innerHTML && !desc) {
                return 1;
            } else if (first.cells[key].innerHTML < second.cells[key].innerHTML && !desc){
                return -1;
            } else if (first.cells[key].innerHTML > second.cells[key].innerHTML && desc){
                return -1;
            } else if (first.cells[key].innerHTML < second.cells[key].innerHTML && desc){
                return 1;
            }
        }
        return 0;
    });

    console.log(rowData)
    
    clearTable("list")
    
    table.append(headers)

    for (let i = 0; i < rowData.length; i++) {
        table.append(rowData[i])
    }

}

setSortSelects(heads, sortForm)
selects[0].addEventListener("change", () => changeNextSelect("second", selects[0]))
selects[1].addEventListener("change", () => changeNextSelect("third", selects[1]))
sortButton.addEventListener("click", () => {
    sortTable("list", sortForm)
})