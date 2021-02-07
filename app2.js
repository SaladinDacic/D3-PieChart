var width = 800;
var height = 500;

var minYear = d3.min(birthData, d=>d.year);
var maxYear = d3.max(birthData, d=>d.year);

var yearData = birthData.filter(d => d.year === minYear);

var months = []
months = birthData.reduce((acc, next)=>{
     if(acc.indexOf(next.month)===-1){
        acc.push(next.month)
     }
     return acc;
}, months)

var quaters = quaterYear(yearData);

var colors = [
    "#aec7e8", "#a7cfc9", "#9fd7a9", "#98df8a", "#bac78e", "#ddb092",
    "#ff9896", "#ffa48c", "#ffaf82", "#ffbb78", "#e4bf9d", "#c9c3c3"
  ];

var colorsInner = [
    "#aec7e8", "#a7cfc9", "#9fd7a9", "#98df8a"
];
  


var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

svg
    .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`)
        .classed("chart", true);

svg
    .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`)
        .classed("inner-chart", true);
      

svg
    .append("text")
        .classed("title", true)
        .attr("x", width / 2)
        .attr("y", 30)
        .style("font-size", "2em")
        .style("text-anchor", "middle")
        .text("Gdje ste raja")

oRadis=width / 4;
iRadius=width / 6 - 40;

drawPie(yearData, colors, months, oRadis, iRadius);
drawPie(quaters, colorsInner);

d3.select('input')
    .property('min', minYear)
    .property('max', maxYear)
    .property('value', minYear)
    .on('input', () => drawPie(+d3.event.target.value, colors, months, oRadis, iRadius));

function drawPie(yearData, colors, months=[1,2,3,4], oRadius=width / 6 - 40, iRadius=0){
    var colorScale = d3.scaleOrdinal()
                    .domain(months)
                    .range(colors);

    var arcs = d3.pie()
            .value(d=>d.births)(yearData)
            .sort((a,b)=>{
                months.indexOf(a.month) - months.indexOf(b.month)
            })

    var path = d3.arc()
            .outerRadius(oRadius)
            .innerRadius(iRadius);

    var chart = d3.select(".chart")
        .selectAll(".arc")
        .data(arcs)


        chart
            .enter()
            .append("path")
                .classed("arc", true)
                .attr("fill", d => colorScale(d.data.month))
                .attr("d", path);

        chart
            .enter()
            .append("path")
                .merge(chart)
                .classed("arc", true)
                .attr("fill", d => colorScale(d.data.month))
                .attr("d", path);
         
}

    

function quaterYear(yearData){
    var quarterTallies = [0, 1, 2, 3].map(n => ({ quarter: n, births: 0 }));
  for (var i = 0; i < yearData.length; i++) {
    var row = yearData[i];
    var quarter = Math.floor(months.indexOf(row.month) / 3);
    quarterTallies[quarter].births += row.births;
  }
  return quarterTallies;
}