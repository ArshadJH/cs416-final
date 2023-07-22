async function render1() {
    data = await d3.csv("https://data.sfgov.org/api/views/rkru-6vcg/rows.csv")
    ref = {}
    for (i in data) {
        if (!(data[i]['Operating Airline'] in ref)) {
            ref[data[i]['Operating Airline']] = []
        }
        ref[data[i]['Operating Airline']].push(Number.parseInt(data[i]['Passenger Count']))
    }

    for (key in ref) {
        ref[key] = ref[key].reduce((a, b) => a + b) / ref[key].length
    }

    data = Object.keys(ref).sort(function(b, a) {
        return ref[a] - ref[b];
    });

    var margin = {top: 30, right: 30, bottom: 160, left: 60}, width = 1250 - margin.left - margin.right, height = 700 - margin.top - margin.bottom;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    var y = d3.scaleLinear().domain([0, 110000]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    var div = d3.select("body").append("div").style("opacity", 0).style("position", "absolute");
               
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d); })
        .attr("y", function(d) { return y(ref[d]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(ref[d]); })
        .attr("fill", "#e28743")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', .5)
            div.transition()
                .duration(50)
                .style("opacity", 1);
            div.html(i + " : " + Number.parseInt(ref[i]) + " monthly passengers")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        }).on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', 1)
            div.transition()
                .duration('50')
                .style("opacity", 0);
        });
    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 100 + width / 2)
        .attr("y", height + 150)
        .text("Airline");
    
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -175)
        .attr("y", -60)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average monthly passengers");
}

async function render2() {
    data = await d3.csv("https://data.sfgov.org/api/views/rkru-6vcg/rows.csv")
    ref = {}
    for (i in data) {
        if (!(data[i]['Activity Period'] in ref)) {
            ref[data[i]['Activity Period']] = 0
        }
        ref[data[i]['Activity Period']] += 1
    }

    delete ref["undefined"]

    data = Object.keys(ref)

    var margin = {top: 30, right: 30, bottom: 120, left: 60}, width = 2760 - margin.left - margin.right, height = 700 - margin.top - margin.bottom;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d; }))
        .padding(0.2);
    svg.append("g")
        .data(data)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .text(function(d) { return Number.parseInt(d.slice(4)) + "/" + d.slice(0, 4); })
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    var y = d3.scaleLinear().domain([0, 175]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width",4.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d); })
        .y(function(d) { return y(ref[d]); })
    )

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 100 + width / 2)
        .attr("y", height + 60)
        .text("Month");
    
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -175)
        .attr("y", -60)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Total number of flights");
    
    for (i in [...Array(4).keys()]) {
        i = Number.parseInt(i) + 6
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", x(`200${i}01`))
            .attr("y", y(ref[`200${i}01`]))
            .text(`200${i}`);
    }

    for (i in [...Array(14).keys()]) {
        i = Number.parseInt(i) + 10
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", x(`20${i}01`))
            .attr("y", y(ref[`20${i}01`]))
            .text(`20${i}`);
    }
}

async function render3() {
    data = await d3.csv("https://data.sfgov.org/api/views/rkru-6vcg/rows.csv")
    ref = {}
    for (i in data) {
        if (!(data[i]['Boarding Area'] in ref)) {
            ref[data[i]['Boarding Area']] = {'Domestic': 0, 'International': 0}
        }
        ref[data[i]['Boarding Area']][data[i]['GEO Summary']] += 1
    }
    
    delete ref["undefined"]
    delete ref["Other"]
    
    data = Object.keys(ref).sort();

    var margin = {top: 30, right: 30, bottom: 120, left: 60}, width = 1260 - margin.left - margin.right, height = 700 - margin.top - margin.bottom;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    var y = d3.scaleLinear().domain([0, 10000]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    var div = d3.select("body").append("div").style("opacity", 0).style("position", "absolute");

    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d); })
        .attr("y", function(d) { return y(ref[d]['Domestic']) - 1; })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(ref[d]['Domestic']); })
        .attr("fill", "#58FF33")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', .5)
            div.transition()
                .duration(50)
                .style("opacity", 1)
            div.html("Domestic: " + Number.parseInt(ref[i]['Domestic']) + " flights")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        }).on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', 1)
            div.transition()
                .duration('50')
                .style("opacity", 0);
        });
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d); })
        .attr("y", function(d) { return y(ref[d]['International'] + ref[d]['Domestic']) - 1; })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(ref[d]['International']); })
        .attr("fill", "#FF3333")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', .5)
            div.transition()
                .duration(50)
                .style("opacity", 1)
            div.html("International: " + Number.parseInt(ref[i]['International']) + " flights")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
        }).on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', 1)
            div.transition()
                .duration('50')
                .style("opacity", 0);
        });
    
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .text("Gate");
    
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -175)
        .attr("y", -60)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Total Number of Flights");
    
    svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#FF3333")
    svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#58FF33")
    svg.append("text").attr("x", 220).attr("y", 130).text("International").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 220).attr("y", 160).text("Domestic").style("font-size", "15px").attr("alignment-baseline","middle")
}