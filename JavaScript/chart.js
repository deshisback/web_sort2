let buildButton = document.querySelector("#buildBtn")
// let radio = document.querySelector("input[name='ox']:checked")
// let checkBoxes = document.querySelectorAll("input[name='oy']")
// let graphType = document.querySelector("#graphType").value

function createArrGraph(data, key) {

    let newArr = data.map((elem) => {
        return {
            "Название": elem[0],
            "Жанр": elem[1],
            "Год выхода": elem[2],
            "Страна": elem[3],
            "Тип": elem[4],
            "Бюджет": elem[5]
        }
    })

    let checkBoxes = document.querySelectorAll("input[name='oy']")
    
    groupObj = d3.group(newArr, d => d[key]);
    let arr = []
    let arrGraph =[];

    for (checkBox of checkBoxes){
        if (checkBox.checked) {
            for(let entry of groupObj) {
                let minMax = d3.extent(entry[1].map(d => parseFloat(d[checkBox.value])));
                arrGraph.push({labelX : entry[0], values : minMax});
            }
            arr.push(arrGraph)
            arrGraph = []
        }
    }

    return arr;
}

function drawGraph(data) {
    // значения по оси ОХ
    const keyX = document.querySelector("input[name='ox']:checked").value

    // создаем массив для построения графика
    const arrGraph = createArrGraph(data, keyX);
    
    let svg = d3.select("svg")  
    svg.selectAll('*').remove();

   // создаем словарь с атрибутами области вывода графика
    attr_area = {
            width: parseFloat(svg.style('width')),
            height: parseFloat(svg.style('height')),
            marginX: 50,
            marginY: 50
    }

    let scX, scY
       
    // создаем шкалы преобразования и выводим оси
    if (arrGraph.length == 1){
        [scX, scY] = createAxis(svg, arrGraph[0], attr_area);
    } else {
        [scX, scY] = createAxis(svg, arrGraph[1], attr_area);
    }
    
    // рисуем график
    let switcher = document.querySelector("#graphType").value

    if (switcher == 1) {
        createChart(svg, arrGraph, scX, scY, attr_area, "red")
    } else if (switcher == 2) {
        createBarChart(svg, arrGraph, scX, scY, attr_area, "red")
    } else {
        createGraph(svg, arrGraph, scX, scY, attr_area, "red")
    }
}

function createAxis(svg, data, attr_area){
    // находим интервал значений, которые нужно отложить по оси OY 
    // максимальное и минимальное значение и максимальных высот по каждой стране
    const [min, max] = d3.extent(data.map(d => d.values[1]));

    // функция интерполяции значений на оси
    // по оси ОХ текстовые значения
     let scaleX = d3.scaleBand()
                    .domain(data.map(d => d.labelX))
                    .range([0, attr_area.width - 2 * attr_area.marginX]);
                    
     let scaleY = d3.scaleLinear()
                    .domain([min * 0.001, max * 1.1 ])
                    .range([attr_area.height - 2 * attr_area.marginY, 0]);               
     
     // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная 
    let axisY = d3.axisLeft(scaleY); // вертикальная

    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, 
                                      ${attr_area.height - attr_area.marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
    
    svg.append("g")
        .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
        .call(axisY);
        
    return [scaleX, scaleY]
}

function createChart(svg, data, scaleX, scaleY, attr_area, color) {
    const r = 4;

    let checkBoxes = document.querySelectorAll("input[name='oy']")
    let budgetBox = checkBoxes[0].checked
    let yearBox = checkBoxes[1].checked

    if (!budgetBox && !yearBox){
        return 0
    } else if (budgetBox && yearBox){
        svg.selectAll(".dot")
            .data(data[0])
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[1]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", color)

        svg.selectAll(".dot")
            .data(data[1])
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[1]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue")
    } else {
        svg.selectAll(".dot")
            .data(data[0])
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[1]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", color)
    }
}

let createBarChart = (svg, data, scaleX, scaleY, attr_area, color) => {
    
    let checkBoxes = document.querySelectorAll("input[name='oy']")
    let budgetBox = checkBoxes[0].checked
    let yearBox = checkBoxes[1].checked
    let budgetData, yearData

    if (data.length == 2){
        budgetData = data[0]
        yearData = data[1]
    } else if (data.length == 1 && budgetBox){
        budgetData = data[0]
    } else {
        yearData = data[0]
    }

    const barWidth = scaleX.bandwidth() * 0.6;

    if (budgetBox) {
        svg.selectAll(".max-bar")
            .data(budgetData)
            .enter()
            .append("rect")
            .attr("class", "max-bar")
            .attr("x", d => 15 + scaleX(String(d.labelX)) + (scaleX.bandwidth() - barWidth)/2)
            .attr("y", d => scaleY(d.values[1]))
            .attr("width", barWidth / 3)
            .attr("height", d => attr_area.height - attr_area.marginY*2 - scaleY(d.values[1]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "blue");
    }

    if (yearBox) {
        svg.selectAll(".min-bar")
            .data(yearData)
            .enter()
            .append("rect")
            .attr("class", "min-bar")
            .attr("x", d => 40 + scaleX(String(d.labelX)) + (scaleX.bandwidth() - barWidth)/2)
            .attr("y", d => scaleY(d.values[0]))
            .attr("width", barWidth / 3)
            .attr("height", d => attr_area.height - attr_area.marginY*2 - scaleY(d.values[0]))
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", color);
    }
}

//реализовать функцию createGraph
let createGraph = (svg, data, scaleX, scaleY, attr_area, color) => {

    let checkBoxes = document.querySelectorAll("input[name='oy']")
    let budgetBox = checkBoxes[0].checked
    let yearBox = checkBoxes[1].checked
    let budgetData, yearData

    if (data.length == 2){
        budgetData = data[0]
        yearData = data[1]
    } else if (data.length == 1 && budgetBox){
        budgetData = data[0]
    } else {
        yearData = data[0]
    }

    const lineGen = d3.line()
        .x(d => scaleX(String(d.labelX)) + scaleX.bandwidth() / 2)
        .y(d => scaleY(d.values[1]));

    if (budgetBox){
        console.log(budgetData)
        svg.append("path")
            .datum(budgetData)
            .attr("class", "line max-line")
            .attr("d", lineGen)
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "none")
            .style("stroke", "blue");
    }
    if (yearBox){
        svg.append("path")
            .datum(yearData)
            .attr("class", "line min-line")
            .attr("d", lineGen)
            .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
            .style("fill", "none")
            .style("stroke", "red");
    }

}

buildButton.addEventListener("click",  () => {
    const table = document.querySelector('#list')
    let rows = Array.from(table.rows)
    rows.shift()
    const data = []

    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td"))
        const rowData = cells.map(cell => cell.textContent.trim())
        data.push(rowData)
    })
    drawGraph(data)
})