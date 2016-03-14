var selected = 'none';
var selectedcircle;
var selectedcirclecolor;


var graph = d3.json('data',
    function(data) {
        data = data['data'] //data, data and also data :)

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

        // arrays for calculating domain
        var periods = [];
        var periods_der = [];
        for (i = 0; i < data.length; i++) {
            periods.push(data[i]['Period'])
        }
        for (i = 0; i < data.length; i++) {
            periods_der.push(Math.log10(data[i]['Period Derivative']))
        }

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


        // x related values init
        var xscale = d3.scale.log()
            .domain([
                Math.round(Math.floor(d3.min(periods) * 10000)) / 10000,
                Math.round(Math.ceil(d3.max(periods) * 10000)) / 10000
            ])
            .range([0, width]),
            xAxis = d3.svg.axis()
            .scale(xscale)
            .ticks(5, function(d) {
                return d.toExponential(2).replace('e', 'x10^')
            })
            .orient("bottom")
            .innerTickSize(-height)
            .outerTickSize(0)
            .tickPadding(5);

        // y related values init
        var yscale = d3.scale.linear()
            .domain([
                Math.floor(d3.min(periods_der)),
                Math.ceil(d3.max(periods_der))
            ])
            .range([height - 0, 0]),
            yAxis = d3.svg.axis()
            .scale(yscale)
            .ticks(20)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(5);

        //zoom function and update
        var zoom = d3.behavior.zoom()
            .x(xscale)
            .y(yscale)
            .on("zoom", function() {
                g_xaxis.call(xAxis);
                g_yaxis.call(yAxis);
                console.log('zoom')
                updategraph()
            });


        function initializegraph() {

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

        function updategraph() {
            var circle =
                canvas
                .select('.points')
                .selectAll('circle')
                .data(data)

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

        //start plotting graph
        // main canvas
        var canvas = d3.select('.graph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .call(zoom)
            .append("g")
            .attr("class", "points")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // y axis
        var g_yaxis = canvas.append("g")
            .attr("class", "axis axis--y")
            .attr("position", "fixed")
        g_yaxis.call(yAxis);

        // x axis
        var g_xaxis = canvas.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height) + ")")
        g_xaxis.call(xAxis);


        var legend = canvas
            .append('g')
            .attr("transform", "translate(" + (width - 230) + ",10)")
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


        // plot points
        canvas
            .append("g")
            .attr("class", "points")

        initializegraph()
        updategraph()
    });

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
$(function() {
    $('#form').submit(function() {
        $('.pulsar-id').val(selected)
        // alert('yo - ' + $('.pulsar-id').val())
        return true;
    });
});
