d3.json('data',
    function(data) {
        data = data['data'] //data, data and also data :)


        var periods = [];
        for (i = 0; i < data.length; i++) {
            periods.push(data[i]['Period'])
        }

        var periods_der = [];
        for (i = 0; i < data.length; i++) {
            periods_der.push(Math.log10(data[i]['Period Derivative']))
        }


        console.log(periods)
        console.log(periods_der)
        console.log(Math.round(Math.floor(d3.min(periods) * 10000)) / 10000, Math.round(Math.ceil(d3.max(periods) * 10000)) / 10000)

        var margin = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50
            },
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;


        var xvalue = function(d) {
                return data['Period'];
            },
            xscale = d3.scale.log()
            // .base(10)
            .domain([
                Math.round(Math.floor(d3.min(periods) * 10000)) / 10000,
                Math.round(Math.ceil(d3.max(periods) * 10000)) / 10000
            ])
            .range([0, width]),
            xAxis = d3.svg.axis()
            .scale(xscale)
            .ticks(5, function(d) {
                // var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";
                // var coff = d.toExponential(2).split("e")[0];
                // var power = d.toExponential(2).split("e")[1];
                // var spr = '';
                // console.log(power)
                // for(i=0;i<power.length;i++)
                // {
                //     var char
                //     if(power[i] == '-')
                //     {char = '-'}
                //     else {
                //         superscript[power[i]]
                //     }
                //     console.log(char)
                //     spr.concat(superscript[power[i]])
                // }
                // console.log(spr)
                // res = coff.concat(spr).replace('e', 'x10')

                return d.toExponential(2).replace('e', 'x10^')
                    // return .toString().parseInt("065", 10).replace('e', '10')
            })
            // .ticks(10, function(d) {
            //     return 10 + formatPower(Math.round(Math.log(d) / Math.LN10));
            // })
            .orient("bottom");

        var yvalue = function(d) {
                return d['Period Derivative'];
            },
            yscale = d3.scale.linear()
            .domain([
                Math.floor(d3.min(periods_der)),
                Math.ceil(d3.max(periods_der))
            ])
            .range([height - 0, 0]),
            yAxis = d3.svg.axis()
            .scale(yscale)
            .ticks(20)
            .orient("left")


        var canvas = d3.select('.graph')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("margin", "100")
            .style("border", "1px solid black");

        canvas.append("g")
            .attr("class", "axis axis--y")
            // .attr("transform", "translate(40,0)")
            .call(yAxis);

        canvas.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis);

        canvas
            .append("g")
            .attr("class", "points")
            // .attr("transform", "translate(40,0)")
            .selectAll('circle')
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d, i) {
                return xscale(d['Period']);
            })
            .attr("cy", function(d, i) {
                return yscale(Math.log10(d['Period Derivative']));
            })
            .attr("r", 2.5);




        //
        //
        //
        // var alternate_ticks = false;
        //
        // var short_tick_length = 4;
        // var long_tick_length = 16;
        //
        // // Alternate the tick line between long and short ticks
        // d3.selectAll("g.axis--x g.tick line")
        //     .attr("y2", function() {
        //         if (alternate_ticks) {
        //             alternate_ticks = false;
        //             return long_tick_length;
        //         } else {
        //             alternate_ticks = true;
        //             return short_tick_length;
        //         }
        //     });
        //
        // alternate_text = false;
        //
        // // Alternate the tick label text to match up with the tick length
        // d3.selectAll("g.axix--x g.tick text")
        //     .attr("y", function() {
        //         if (alternate_text) {
        //             alternate_text = false;
        //             return long_tick_length + 1;
        //         } else {
        //             alternate_text = true;
        //             return short_tick_length + 1;
        //         }
        //     });
        //

    });
