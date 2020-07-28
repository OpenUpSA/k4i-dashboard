


class CustomBubbles extends dc.BubbleChart {
    constructor (parent, chartGroup) {
        super(parent, chartGroup);
        this.dataNodes = [];

        this.xAxisPadding(200)
        this.yAxis().tickValues([]);
        // console.log(this.yAxis());
        
    }

    createNodes() {

        console.log('createNodes...')

        var rawData = this.data()

        // use max size in the data as the max in the scale's domain
        // note we have to ensure that size is a number
        const maxSize = d3.max(rawData, d => +d.value);


        // size bubbles based on area
        const radiusScale = d3.scaleSqrt()
            .domain([0, maxSize])
            .range([0, 32])

        // TODO retrieve x and y
        // use map() to convert raw data into node data
        var buildingDataNodes = rawData.map(d => ({
            ...d,
            radius: radiusScale(+d.value) + 10, // 10min
            x: (Math.random() - 0.5) * 1,
            y: (Math.random() - 0.5) * 1
        }))

        this.dataNodes = buildingDataNodes;
        console.log("createdNodes", this.dataNodes);
    }

    _shouldLabel(d){
        return true;
    }
            
    _bubbleLocator (d) {
        alert('403')
        return `translate(${this._bubbleX(d)},${this._bubbleY(d)})`;
    }


    plotData () {
        //this.calculateRadiusDomain();
        //this.r().range([this.MIN_RADIUS, this.xAxisLength() * this.maxBubbleRelativeSize()]);

        // [{key:[100, 20], value: 1}, {}] each group
        // const data = this.data();
        this.createNodes()

        // local
        // svg>g>g.chart-body>g.node>circle 

        // Dangerous
        let bubbleG = this.chartBodyG().selectAll(`g.${this.BUBBLE_NODE_CLASS}`)
            .data(this.dataNodes, d => d.index);
        
            /*
        if (this.sortBubbleSize()) {
            // update dom order based on sort
            bubbleG.order();
        }*/

        this._removeNodes(bubbleG);

        bubbleG = this._renderNodes(bubbleG);

        this._updateNodes(bubbleG);

        this.fadeDeselectedArea(this.filter());
    }

    _renderNodes (bubbleG) {
        
        console.log('_renderNodes', bubbleG)

        const bubbleGEnter = bubbleG.enter().append('g');

        var bubblesSVG = bubbleGEnter
            .attr('class', this.BUBBLE_NODE_CLASS)   //???
            .append('circle').attr('class', (d, i) => `${this.BUBBLE_CLASS}`)
            .on('click', d => this.onClick(d))
            .attr('r', d => d.radius)
            .attr('fill', d => '#2e78f6')
            .attr('stroke', "blue")
            .attr('stroke-width', "2")

        var labelsSVG = bubbleGEnter
            .append('text')
            // .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .style('font-size', 10)
            .text(d => " " + d.key + ": " + d.value)
            .style("visibility", function(d) {
                // var ddd = d3.select(this.parentNode).select('circle').attr('r')*2;
                // var mmm = d3.select(this.parentNode).select('text').attr({ x: -99999, y: -99999 }).node().getBBox();
                // console.log("lbls", ddd, mmm);

                return 80 > d3.select(this.parentNode).select('circle').attr('r')*2? "hidden": "visible" // display or not
            })

        bubbleG = bubbleGEnter.merge(bubbleG);

        // create a force simulation and add forces to it
        const simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(charge))
            // .force('center', d3.forceCenter(centre.x, centre.y))
            .force('x', d3.forceX().strength(forceStrength).x(centre.x))
            .force('y', d3.forceY().strength(forceStrength).y(centre.y))
            .force('collision', d3.forceCollide().radius(d => d.radius + 2));      // margins

        // force simulation starts up automatically, which we don't want as there aren't any nodes yet
        simulation.stop();

        simulation.nodes(this.dataNodes)
            .on('tick', function(){

                console.log("ON TICK");

                // repositioning
                bubblesSVG
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)

                labelsSVG
                    .attr('x', d => d.x)
                    .attr('y', d => d.y)
            })
            .restart();

        this._doRenderLabel(bubbleGEnter);
        this._doRenderTitles(bubbleGEnter);

        // textElement.getBBox();

        return bubbleG;
    }

    _updateNodes (bubbleG) {

        console.log("UPD NODES!", bubbleG);

        this.doUpdateLabels(bubbleG);
        this.doUpdateTitles(bubbleG);
    }

    _removeNodes (bubbleG) {
        var rem = bubbleG.exit().remove();
        console.log('REM Nodes', rem);
    }

    _bubbleX (d) {
        alert(403)
    }

    _bubbleY (d) {
        alert(403)
    }

}