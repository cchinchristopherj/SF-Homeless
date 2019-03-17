// Function to reformat raw data
function transformData(data){
    return data.map(function(row) {
        return {
            // Year 
            year: row.Date.substring(4),
            // Percentage of Population in Poverty
            poverty: +row.Poverty,
            // Number of Homeless
            count: +row.Count,
            // House Price Index
            house: +row.Housing,
            // Unemployment Rate
            unemployment: +row.Unemployment,
        }
    })
}
// Function to build d3 chart (to be called after data is loaded)
function makeChart(){
    // Margins
    var margin = {top:5,right:5,bottom:5,left:5},
        // Svg Width 
        width = 800-margin.left-margin.right,
        // Svg Height 
        height = 800-margin.top-margin.bottom,
        // External radial chart inner radius 
        innerRadius1=200,
        // External radial chart outer radius
        outerRadius1=Math.min(width,height)/2,
        // Internal radial chart inner radius
        innerRadius2=30,
        // Internal radial chart outer radius
        outerRadius2=innerRadius1-40;
    var svg = d3.select('#my_dataviz')
        // Append svg to div 
        .append("svg")
            .attr("id","container")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom)
        // Translate group that will hold all chart elements
        .append("g")
            .attr("transform","translate("+width/2+","+(height/2+30)+")");
    // Create scale to encode the year data
    // Range is from -Pi/2 to Pi/2 to plot as a semicircle
    var x = d3.scaleBand()
        .domain(data.map(function(d) {return d.year;}))
        .range([-Math.PI/2,Math.PI/2])
        .align(0);
    // Create scale to encode the poverty percentage data
    // Range is chosen so that the poverty data will be plotted in
    // the internal radial chart 
    var y1 = d3.scaleRadial()
        .domain([0,d3.max(data,function(d) {return d.poverty;})])
        .range([innerRadius2,outerRadius2]);
    // Create scale to encode the house price index data
    // Range is chosen so that the house data will be plotted in the
    // external radial chart
    var y2 = d3.scaleRadial()
        .domain([0,d3.max(data,function(d) {return d.house;})])
        .range([innerRadius1,outerRadius1]);
    // Create internal radial chart of poverty data
    var povertyChart = svg.append("g")
        .selectAll("path")
        .data(data)
        .enter()
        // Create svg path using d3.arc() generator function
        .append("path")
            .attr("fill","#a4a4b9")
            .attr("d",d3.arc()
                // Set radial size of arc to correspond with poverty
                // data values 
                .innerRadius(function(d) {return y1(0);})
                .outerRadius(function(d) {return y1(d.poverty);})
                // Set position of arc (i.e. its angle) in space to
                // correspond with the year values. Each arc will span
                // the same distance specified by the bandwidth of the
                // x scale
                .startAngle(function(d) {return x(d.year);})
                .endAngle(function(d) {return x(d.year)+x.bandwidth();})
                // Pad angle and pad radius determine fixed linear
                // distance between adjacent arcs
                .padAngle(0.01)
                .padRadius(innerRadius1));
    // Create external radial chart of house data
    var houseChart = svg.append("g")
        .attr("fill","#98241f")
        .selectAll("path")
        .data(data)
        .enter()
        // Create svg path using d3.arc() generator function
        .append("path")
            .attr("d",d3.arc()
                // Set radial size of arc to correspond with house
                // data values
                .innerRadius(function(d) {return y2(0);})
                .outerRadius(function(d) {return y2(d.house);})
                // Set position of arc (i.e. its angle) in space to 
                // correspond with the year values. Each arc will span
                // the same distance specified by the bandwidth of the
                // x scale
                .startAngle(function(d) {return x(d.year);})
                .endAngle(function(d) {return x(d.year)+x.bandwidth();})
                // Pad angle and pad radius determine fixed linear 
                // distance between adjacent arcs
                .padAngle(0.1)
                .padRadius(innerRadius2));

    // A grid of 100 squares will be displayed within each arc of the
    // external radial chart. The percentage of squares that are
    // yellow indicates the employment rate, while the percentage 
    // of squares that are black indicates the unemployment rate. (For
    // example, if all 100 squares are yellow, there is 100%
    // employment rate. If 90 squares are yellow and 10 squares are 
    // black, there is 90% employment rate and 10% unemployment rate).

    // d3 symbol generator for a square 
    var symbolGenerator = d3.symbol().size(100).type(d3.symbolSquare);
    // Number of squares to create
    var numIcons = 100;
    // Height of the grid of squares within each arc
    var iconHeight = numIcons/10;
    // Width of the grid of squares within each arc
    var iconWidth = numIcons/(numIcons/10);
    // Vertical padding between rows in the grid
    var verPadding = 22;
    // Vertical offset of the grid away from the origin
    var verOffset = 20;

    // In order to create a grid of squares in an arc, the coordinate
    // system must first be rotated and translated with new origin at 
    // the center of the bottom of the arc. Since there are an even
    // number of columns, no column is exactly centered on the origin.
    // Instead, the 5th column from the left of the grid is moved 
    // angleOffset units in the -y direction from the origin, while 
    // the 6th column from the left of the grid is moved angleOffset 
    // units in the +y direction from the origin. Further, each 
    // column to the left of the 5th column is moved anglePadding
    // units in the -y direction from the column to its right, while 
    // each column to the right of the 6th column is moved
    // anglePadding units in the +y direction from the column to its
    // right. 

    // angleOffset for the 5th and 6th columns from the left of the
    // grid
    var angleOffset = 8;
    // Number of units in the y direction to move between each column 
    var anglePadding = 16;
    // Create a grid of squares in each arc of the external radial
    // chart
    var squares = svg.append("g")
        .attr("id","squareLayer")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")

        // For each arc in the external radial chart, rotate and 
        // translate the coordinate system so that the new origin is
        // located in the center of the bottom of the arc. Since each
        // arc's position in the chart was initially determined by the
        // value of year corresponding to it, use the year data once 
        // again to rotate and translate the coordinate system to the 
        // correct location for each arc. Also, scale symbols to be 
        // half size using scale(0.5). 
        .attr("transform",function(d){
            return "rotate("+((x(d.year)+x.bandwidth()/2)*180/Math.PI-90)+")translate("+innerRadius1+",0)scale(0.5)";
        })
        .selectAll("path")
        .data(d3.range(numIcons))
        .enter()
        // Create svg path using symbolGenerator()
        .append("path")
            .attr("d",function(d){
                return symbolGenerator();
            })
            // The position of each square is determined by its 
            // associated value. For example, squares with data values 
            // from 0-9 are placed in the first column from the 
            // left of the grid. The column's first square is placed
            // in the lowest row from from the top and each subsequent 
            // square is translated in the x direction using the value
            // of verPadding to place it in the row above. Likewise,
            // squares with data values from 10-19 are placed in the 
            // second column, and so on.
            .attr('transform', function(d) {
                if(d<=(iconHeight-1)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(-angleOffset-anglePadding*4)+')';
                } else if(d>(iconHeight-1) && d<=(((iconHeight-1)*2)+1)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(-angleOffset-anglePadding*3)+')';
                } else if(d>(((iconHeight-1)*2)+1) && d<=(((iconHeight-1)*3)+2)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(-angleOffset-anglePadding*2)+')';
                } else if(d>(((iconHeight-1)*3)+2) && d<=(((iconHeight-1)*4)+3)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(-angleOffset-anglePadding*1)+')';
                } else if(d>(((iconHeight-1)*4)+3) && d<=(((iconHeight-1)*5)+4)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(-angleOffset)+')';
                } else if(d>(((iconHeight-1)*5)+4) && d<=(((iconHeight-1)*6)+5)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(angleOffset)+')';
                } else if(d>(((iconHeight-1)*6)+5) && d<=(((iconHeight-1)*7)+6)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(angleOffset+anglePadding*1)+')';
                } else if(d>(((iconHeight-1)*7)+6) && d<=(((iconHeight-1)*8)+7)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(angleOffset+anglePadding*2)+')';
                } else if(d>(((iconHeight-1)*8)+7) && d<=(((iconHeight-1)*9)+8)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(angleOffset+anglePadding*3)+')';
                } else if(d>(((iconHeight-1)*9)+8)){
                    return 'translate('+((d%iconHeight)*verPadding+verOffset)+','+(angleOffset+anglePadding*4)+')';
                }
            })
        // Since employment rate was greater than 90% in the dataset
        // and the percentage of squares colored yellow indicates the
        // employment rate, color all the squares yellow initially
        // for simplicity by assinging each square to the class 
        // "squareLit." Individual squares will be assigned to the 
        // class "squarePlain" colored black (with black squares 
        // indicating unemployment) in the for loop that follows.
        .attr("class",function(d){
            return "squareLit";
        });
    // The grid of squares in each arc of the external radial chart 
    // represents the employment/unemployment rate for that particular
    // year. Since the percentage of squares colored black represents
    // the unemployment rate, use the value of unemployment rate from 
    // the dataset to deterine how many squares should be colored 
    // black for each year. 
    for(i=0;i<data.length;i++){
        var rate = Math.floor(data[i].unemployment);
        // The d3.select(squares.nodes()) statement selects all the
        // squares present in the external radial chart. The i index
        // indicates which arc the squares are present in and the 
        // j index indicates which square in the grid is being 
        // selected. Squares are indexed from the bottom-most row
        // upward, from the left-most column to right-most column. 
        // In this case, it is desired to change a specific number
        // of squares (according to the data) to a black color in 
        // one of the rows of the grid. The grid_row variable
        // indicates which row to select (with the bottom-most row
        // being index 0). Due to the indexing of the squares from 
        // bottom up and left to right, multiplying the index j by 
        // iconHeight allows only squares in the desired row to be 
        // selected. For squares that are selected, the class is 
        // changed to "squarePlain" to change the color to black. 
        var grid_row = 9;
        for(j=0;j<rate;j++){
            d3.select(squares.nodes()[grid_row+i*100+j*iconHeight]).attr("class","squarePlain"); 
        }
    }
    // A sequence of symbols of people will be displayed within each 
    // arc of the internal radial chart, with each symbol representing
    // ~800 homeless. Therefore, the total number of symbols displayed
    // indicates the total number of homeless counted in San Francisco
    // that year. 
    // The symbols of people will be created using the "defs" element
    // to store information about drawing the graphical object 
    svg.append("defs")
        .append("g")
        .attr("id","iconCustom")
        .append("path")
            .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");
    // In order to create a sequence of symbols in an arc, the 
    // coordinate system must first be rotated and translated with 
    // new origin at the center of the bottom of the arc. Since each
    // arc's position in the chart was initially determined by the
    // value of year corresponding to it, use the year data once 
    // again to rotate and translate the coordinate system to the 
    // correct location for each arc. Also, scale symbols to be 
    // nearly double their size using scale(1.9).
    // For each arc, the desired sequence of symbols is created by 
    // placing each symbol one after the other farther and farther
    // from the origin along the arc's center. The first symbol is
    // placed radialOffset units away from the origin (for clearer 
    // display) and each subsequent symbol is placed radialPadding 
    // units away from the previous one. The value rotationOffset 
    // specifies an additional rotation of the sequence of symbols
    // to align them with their corresponding arc. 
    var radialOffset = 5;
    var radialPadding = 5;
    var rotationOffset = -4; 
    svg.append("g")
        .attr("id","pictoLayer")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform",function(d){
            return "rotate("+((x(d.year)+x.bandwidth()/2)*180/Math.PI-90)+")translate("+innerRadius2+",0)scale(1.9)";})
        .selectAll("use")
        // Convert Number of Homeless into number of displayable
        // icons by dividing by 800. Convert into an arithmetic
        // progression for plotting using d3.range()
        .data(function(d){return d3.range(d.count/800);})
        .enter()
        .append("use")
            .attr("xlink:href","#iconCustom")
            .attr("id",function(d){
                return "icon"+d;
            })
            // x and y positions of each sequence of symbols are 
            // determined by the radialPadding, radialOffset, and
            // rotationOffset variables.
            .attr("x",function(d){
                return d*radialPadding+radialOffset;
            })
            .attr("y",rotationOffset)
            // Assign the class "iconPlain" to each symbol, which
            // specifies the color blue. 
            .classed("iconPlain",true);
    // Since there is one arc in the external radial chart and one arc
    // in the internal radial chart corresponding to each year in the
    // dataset, labels for years will be placed between the external
    // radial chart and internal radial chart (lined up radially with
    // their corresponding arcs in each chart).
    var label = svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor","middle") 
        // The text will be oriented using the external radial chart. 
        // For each arc in the external radial chart, rotate and 
        // translate the coordinate system so that the new origin is
        // located in the center of the bottom of the arc. Since each
        // arc's position in the chart was initially determined by the
        // value of year corresponding to it, use the year data once 
        // again to rotate and translate the coordinate system to the 
        // correct location for each arc. 
        .attr("transform",function(d){
            return "rotate("+((x(d.year)+x.bandwidth()/2)*180/Math.PI-90)+")translate("+innerRadius1+",0)";});
    // Add text for the year corresponding to each arc by performing
    // an additional translation so that the label appears between 
    // the external and internal radial charts. 
    label.append("text")
        .attr("font-weight","bold")
        .attr("transform",function(d){
            return (x(d.year)+x.bandwidth()/2+Math.PI/2)%(2*Math.PI)<Math.PI?"rotate(90)translate(0,32)":"rotate(-90)translate(0,-9)";})
        .text(function(d){
            return d.year;});
    // The size of the arcs in the external radial chart corresponds to
    // each year's house price index. Create "axes" for the external
    // radial chart by drawing semicircular lines through the arcs, 
    // denoting the values corresponding to each arc's size. 
    var yAxis1 = svg.append("g")
        .attr("text-anchor","middle");
    var yTick1 = yAxis1
        .selectAll("g")
        // Use the last three tick values of the scale defined in y2 
        // to create the "axes" for the external radial chart. 
        .data(y2.ticks(5).slice(3))
        .enter()
        .append("g");
    yTick1.append("path")
        .attr("d",d3.arc()
            // Each semicircular line "axis" is positionined according
            // to the value of the ticks in the y2 scale.
            .innerRadius(function(d){return y2(d);})
            // Each semicircular line "axis" is an arc with radius 0.5
            .outerRadius(function(d){return y2(d)+0.5;})
            .startAngle(-Math.PI/2)
            .endAngle(Math.PI/2)
            .padAngle(0.1)
            .padRadius(innerRadius1));
    // Create text labels for each semicircular line "axis"
    // First create the white outline for each text label
    yTick1.append("text")
        .attr("font-size","15px")
        .attr("y", function(d) { return -y2(d); })
        .attr("dy", "0.2em")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 4.5)
        .text(y2.tickFormat(5, "s"));
    // Next create the text label witin each outline
    yTick1.append("text")
        .attr("font-size","15px")
        .attr("y", function(d) { return -y2(d); })
        .attr("dy", "0.2em")
        .text(y2.tickFormat(5, "s"));
    // Create a label for the set of semicircular line "axes" of the 
    // external radial chart
    yAxis1.append("text")
        // Position the label for the set of semicircular line "axes"
        // above the label of the top-most semicircular line axis.
        .attr("y",function(d){
            return -y2(y2.ticks(5).pop());})
        .attr("font-weight","bold")
        .attr("dy","-1em")
        .text("House Price Index");
    // The size of the arcs in the internal radial chart corresponds to
    // each year's percentage of the population in poverty. Create 
    // "axes" for the internal radial chart by drawing semicircular 
    // lines through the arcs, denoting the values corresponding to 
    // each arc's size. 
    var yAxis2 = svg.append("g")
        .attr("text-anchor","middle");
    // Use the last two tick values of the scale defined in y2 to
    // create the "axes" for the internal radial chart. 
    var yTick2 = yAxis2
        .selectAll("g")
        .data((y1.ticks(5).slice(5)))
        .enter()
        .append("g");
    yTick2.append("path")
        .attr("d",d3.arc()
            // Each semicircular line "axis" is positionined according
            // to the value of the ticks in the y1 scale.
            .innerRadius(function(d){return y1(d);})
            // Each semicircular line "axis" is an arc with radius 0.5
            .outerRadius(function(d){return y1(d)+0.5;})
            .startAngle(-Math.PI/2)
            .endAngle(Math.PI/2)
            .padAngle(0.1)
            .padRadius(innerRadius1));
    // Create text labels for each semicircular line "axis"
    // First create the white outline for each text label
    yTick2.append("text")
        .attr("font-size","12.5px")
        .attr("y", function(d,i) { return -y1(d)-i*3; })
        .attr("dy", "0.4em")
        .attr("fill","none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 4.5)
        .text(function(d){return d+"%";});
    // Next create the text label witin each outline
    yTick2.append("text")
        .attr("font-size","12.5px")
        .attr("y",function(d,i){ return -y1(d)-i*3; })
        .attr("dy","0.4em")
        .text(function(d){return d+'%';});
    // Create a label for the set of semicircular line "axes" of the 
    // internal radial chart
    yAxis2.append("text")
        // Position the label for the set of semicircular line "axes"
        // below the label of the bottom-most semicircular line axis.
        .attr("y",function(d){
            return -y1(0);})
        .attr("font-weight","bold")
        .attr("font-size","15px")
        .attr("dy","2em")
        .text("Poverty");
    // Create a legend for the symbols of people in the internal
    // radial chart. 
    // Translate the legend to be centered below the internal radial
    // chart 
    var legend1 = svg.append("g")
        .attr("transform","translate(-70,40)");
    // Create a box around the legend
    legend1.append("rect")
        .attr("stroke","black")
        .attr("stroke-width",1)
        .attr("width",145)
        .attr("height",30)
        .attr("fill-opacity",0)
    // Add the symbol of a person to the legend 
    legend1.append("use")
        .attr("xlink:href","#iconCustom")
        .attr("transform","scale(2)")
        .attr("x",5)
        .attr("y",4)
        .classed("iconPlain",true);
    // Add a text description for the symbol of a person
    legend1.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .attr("dy", "0.35em")
        .text("= ~800 Homeless");
    // Create a legend for the yellow squares in the external radial
    // chart.
    // Translate the legend to be below the external radial chart on
    // the left side. 
    var legend2 = svg.append("g")
        .attr("transform","translate(-345,40)");
    // Create a box around the legend
    legend2.append("rect")
        .attr("stroke","black")
        .attr("stroke-width",1)
        .attr("width",185)
        .attr("height",30)
        .attr("fill-opacity",0)
    // Add the yellow square (as a rect) to the legend 
    legend2.append("rect")
        .attr("transform","scale(2)")
        .attr("x",5)
        .attr("y",5)
        .attr("stroke","black")
        .attr("stroke-width",1)
        .attr("width",5)
        .attr("height",5)
        .attr("fill","yellow");
    // Add a text description for the yellow square
    legend2.append("text")
        .attr("x", 25)
        .attr("y", 13)
        .attr("dy", "0.35em")
        .text("= 1% Employment Rate");
    // Create a legend for the black squares in the external radial
    // chart.
    // Translate the legend to be below the external radial chart on
    // the right side. 
    var legend3 = svg.append("g")
        .attr("transform","translate(195,40)");
    // Create a box around the legend
    legend3.append("rect")
        .attr("stroke","black")
        .attr("stroke-width",1)
        .attr("width",200)
        .attr("height",30)
        .attr("fill-opacity",0)
    // Add the black square (as a rect) to the legend
    legend3.append("rect")
        .attr("transform","scale(2)")
        .attr("x",5)
        .attr("y",5)
        .attr("stroke","black")
        .attr("stroke-width",1)
        .attr("width",5)
        .attr("height",5)
        .attr("fill","black");
    // Add a text description for the black square
    legend3.append("text")
        .attr("x", 25)
        .attr("y", 13)
        .attr("dy", "0.35em")
        .text("= 1% Unemployment Rate");
    // Add a tooltip for the external radial chart as a div
    var tooltip1 = d3.select("body").append("div")
        .style("position","absolute")
        .style("z-index","10")
        // The div is set by default to be hidden
        .style("visibility","hidden")
        .style("color","white")
        .style("padding","8px")
        .style("background-color","rgba(0,0,0,0.75)")
        .style("border-radius","6px")
        .style("font","12px sans-serif")
        .text("tooltip");
    // The tooltip div becomes visible when the user mouses 
    // over the external radial chart 
    houseChart.on("mouseover",function(d){
        tooltip1.html('Year: '+d.year+'<br>'+
                    'Employment: '+(100-d.unemployment)+'%'+'<br>'+
                    'House Price Index: '+d.house);
        tooltip1.style("visibility","visible");
    })
    // The tooltip is positioned according to the location of
    // the user's mouse
    .on("mousemove",function(){
        return tooltip1.style("top",(d3.event.pageY-10)+'px')
                    .style("left",(d3.event.pageX+10)+'px');
    })
    // The tooltip becomes hidden when the user mouses out of 
    // the external radial chart
    .on("mouseout",function(){
        return tooltip1.style("visibility","hidden");
    });
    // Add a tooltip for the internal radial chart as a div
    var tooltip2 = d3.select("body").append("div")
        .style("position","absolute")
        .style("z-index","10")
        // The div is set by default to be hidden
        .style("visibility","hidden")
        .style("color","white")
        .style("padding","8px")
        .style("background-color","rgba(0,0,0,0.75)")
        .style("border-radius","6px")
        .style("font","12px sans-serif")
        .text("tooltip");
    // The tooltip div becomes visible when the user mouses 
    // over the internal radial chart
    povertyChart.on("mouseover",function(d){
        tooltip2.html('Year: '+d.year+'<br>'+
                    'Poverty: '+d.poverty+'%'+'<br>'+
                    'Total Homeless: '+d.count);
        tooltip2.style("visibility","visible");
    })
    // The tooltip is positioned according to the location of
    // the user's mouse
    .on("mousemove",function(){
        return tooltip2.style("top",(d3.event.pageY-10)+'px')
                    .style("left",(d3.event.pageX+10)+'px');
    })
    // The tooltip becomes hidden when the user mouses out of
    // the internal radial chart
    .on("mouseout",function(){
        return tooltip2.style("visibility","hidden");
    });
}
// Load in the data using d3.csv()
var data;
d3.csv("SFHomeless.csv",function(rawData){
    data = transformData(rawData);
    makeChart();
});