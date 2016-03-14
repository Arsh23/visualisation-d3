var selected = 'none';
var selectedcircle;
var selectedcirclecolor;
var data2;


//size and margin
var basewidth = $('.graph').width()
var baseheight = $('.graph').height()
var margin = {
        top: 10,
        right: 10,
        bottom: 30,
        left: 40
    },
    width = basewidth - margin.left - margin.right,
    height = baseheight - margin.top - margin.bottom;


// main canvas
var svg = d3.select('.graph')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
var canvas = svg.append("g")
    .attr("class", "points")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


// plot points
canvas
    .append("g")
    .attr("class", "points")

// x related values init
var xscale = d3.scale.log(),
    xAxis = d3.svg.axis(),
    g_xaxis = canvas.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height) + ")")


// y related values init
var yscale = d3.scale.linear(),
    yAxis = d3.svg.axis(),
    g_yaxis = canvas.append("g")
    .attr("class", "axis axis--y")
    .attr("position", "fixed")

// arrays for calculating domain
var periods = [];
var periods_der = [];

//initialize everything with data
d3.json('data',
    function(data) {
        data2 = data['data']
        initializegraph(data2)
    });

//legend initialize
var legend = canvas
    .append('g')
    .attr("transform", "translate(" + (width - 230) + ",10)")
drawlegend()

var graph = d3.json('data',
    function(data) {
        data = data['data'] //data, data and also data :)

        initializegraph(data)

        //zoom function and update
        var zoom = d3.behavior.zoom()
            .x(xscale)
            .y(yscale)
            .on("zoom", function() {
                updategraph(data)
            });
        svg.call(zoom)
        updategraph(data)
    });


function initializegraph(data) {

    //initialize all axis
    g_xaxis.call(xAxis);
    g_yaxis.call(yAxis);

    // arrays for calculating domain
    for (i = 0; i < data.length; i++) {
        periods.push(data[i]['Period'])
    }
    for (i = 0; i < data.length; i++) {
        periods_der.push(Math.log10(data[i]['Period Derivative']))
    }

    // x related values
    xscale
        .domain([
            Math.round(Math.floor(d3.min(periods) * 10000)) / 10000,
            Math.round(Math.ceil(d3.max(periods) * 10000)) / 10000
        ])
        .range([0, width]);
    xAxis
        .scale(xscale)
        .ticks(5, function(d) {
            return d.toExponential(2).replace('e', 'x10^')
        })
        .orient("bottom")
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(5);

    // y related values
    yscale
        .domain([
            Math.floor(d3.min(periods_der)),
            Math.ceil(d3.max(periods_der))
        ])
        .range([height - 0, 0]);
    yAxis
        .scale(yscale)
        .ticks(20)
        .orient("left")
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(5);
}

function updategraph(data) {
    var circle =
        canvas
        .select('.points')
        .selectAll('circle')
        .data(data)

    //update axis
    g_xaxis.call(xAxis);
    g_yaxis.call(yAxis);

    //remove extra data
    circle.exit().remove()

    // add new data
    circle.enter()
        .append("circle")
        .attr("class", "datapoint")
        .attr("id", function(d) {
            return d['Pulsar']
        })
        .attr("data-legend", function(d) {
            if (d['Binary'] == 'Y') {
                return 'Binary'
            } else {
                return 'Non Binary'
            }
        })
        .style('fill', function(d) {
            if (d['Binary'] == 'Y') {
                return '#FF3D00'
            } else {
                return '#3D5AFE'
            }
        })
        .attr("cx", function(d, i) {
            return xscale(d['Period']);
        })
        .attr("cy", function(d, i) {
            return yscale(Math.log10(d['Period Derivative']));
        })
        .on("mouseover", updatedata)
        .on("mouseout", removedata)
        .on('click', selectdata)
        .attr("r", 12)
        .attr("opacity", 0)
        .transition()
        .duration(200)
        .delay(function(d, i) {
            return (50 * i)
        })
        .attr("r", 2.5)
        .attr("opacity", 0.75)

    // update data
    circle
        .attr("cx", function(d, i) {
            return xscale(d['Period']);
        })
        .attr("cy", function(d, i) {
            return yscale(Math.log10(d['Period Derivative']));
        })
}

//runs on mouseclick on node
var selectdata = function() {
    if (selected != 'none') {
        selected = 'none'
    } else {
        selected = d3.select(this).attr('id')
        selectedcircle = d3.select(this)
        selectedcirclecolor = d3.select(this).style('fill')
        selectedcircle
            .transition()
            .duration(150)
            .attr('r', 8)
            .style('fill', '#00C853')
            .style('stroke-width', 2)
            .style('stroke', 'rgba(0,0,0,0.25)')
    }
}

//runs on mouseenter on node
var updatedata = function() {
    if (selected == 'none') {
        selectedcirclecolor = d3.select(this).style('fill')
        var circle = d3.select(this);
        circle.transition()
            .duration(150)
            .attr("r", 6)
        var name = d3.select(this).attr('id');
        $('.pulsarname').html(name)
        $.ajax({
                url: "/data/" + name,
            })
            .done(function(data) {
                $('.toa').html(data['TOAs'])
                $('.raw').html(data['Raw Profiles'])
                $('.period').html(data['Period'])
                $('.pd').html(data['Period Derivative'])
                $('.dm').html(data['DM'])
                $('.rms').html(data['RMS'])
                $('.binary').html(data['Binary'])
            });
    }
}

//runs on mouseleave on node
var removedata = function() {
    if (selected == 'none') {
        var circle = d3.select(this);
        circle.transition().duration(150)
            .attr("r", 2.5)
            .style('fill', selectedcirclecolor)
            .style('stroke-width', 0)
            .style('stroke', 'rgba(0,0,0,0)');
        $('.pulsarname').html('')
        $('.toa').html('')
        $('.raw').html('')
        $('.period').html('')
        $('.pd').html('')
        $('.dm').html('')
        $('.rms').html('')
        $('.binary').html('')
    }
}

//draws the legend on the graph
function drawlegend() {
    legend
        .append('rect')
        .attr('class', 'legend')
        .attr('height', 50)
        .attr('width', 220)
        .attr('fill', 'white')
        .style('stroke-width', 2)
        .style('stroke', 'rgba(0,0,0,0.25)')

    legend.append('text')
        .attr("x", 5)
        .attr("y", 15)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('X Axis: Period (Sec) [logarithmic scale]')
    legend.append('text')
        .attr("x", 5)
        .attr("y", 30)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('Y Axis: log(Period Derivative) (Sec/sec)')
    legend
        .append("circle")
        .attr('cx', 10)
        .attr('cy', 41)
        .attr('r', 3)
        .attr("opacity", 0.75)
        .style('fill', '#FF3D00')
    legend.append('text')
        .attr("x", 18)
        .attr("y", 45)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('Binary')
    legend
        .append("circle")
        .attr('cx', 80)
        .attr('cy', 41)
        .attr('r', 3)
        .attr("opacity", 0.75)
        .style('fill', '#3D5AFE')
    legend.append('text')
        .attr("x", 88)
        .attr("y", 45)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('Non Binary')

}

//runs on 'unselect node'
$(document).on('click', '.btn-hide',
    function() {
        if (selected != 'none') {
            selected = 'none'
            selectedcircle
                .transition()
                .duration(150)
                .attr("r", 2.5)
                .style('fill', selectedcirclecolor)
                .style('stroke-width', 0)
                .style('stroke', 'rgba(0,0,0,0)');
            $('.pulsarname').html('')
            $('.toa').html('')
            $('.raw').html('')
            $('.period').html('')
            $('.pd').html('')
            $('.dm').html('')
            $('.rms').html('')
            $('.binary').html('')
        }
    }
);

//runs on 'delete node'
$(function() {
    $('#form').submit(function() {
        $('.pulsar-id').val(selected)
            // alert('yo - ' + $('.pulsar-id').val())
        return true;
    });
});

// 
// setInterval(function(){
//     d3.json('data',
//         function(data) {
//             data = data['data'] //data, data and also data :)
//
//             // initializegraph(data)
//             updategraph(data)
//         });
//  }, 2000);
