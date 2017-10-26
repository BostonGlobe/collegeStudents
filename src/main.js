'use strict';
(function() {
    // global variables
    var screenWidth = window.innerWidth;
    console.log(screenWidth);
    var axisData =['BLACK','INTERNATIONAL', 'WHITE','HISPANIC','ASIAN','OTHERS'];
    var color = {
        'WHITE': '#ddd',
        'BLACK': '#3F98DC',
        'INTERNATIONAL': '#F7D33F',
        'HISPANIC': '#ddd',
        'ASIAN': '#ddd',
        'OTHERS':'#ddd'
    };
    var th=2;
    // called once on page load
    var init = function() {

    };

    // called automatically on article page resize
    window.onResize = function(width) {

    };

    // called when the graphic enters the viewport
    window.enterView = function() {

    };

// Set the dimensions and margins of the diagram
    var margin = {top: 20, right: 50, bottom: 30, left: 20},
        width =  (document.getElementById('container').clientWidth)  - margin.left - margin.right,
        height = document.getElementById('container').clientHeight - margin.top - margin.bottom;
    var simulation;
    var dataCircles96=[];
// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = d3.select("#container").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom);

    var axisYData = ['1996', '2015'];
    // graphic code
    var scaleY= d3.scaleBand()
        .domain(axisData)
        .range([120, height]);
    var scaleX= d3.scaleBand()
        .domain(axisYData)
        .range([0, 2*width/3]);


    d3.queue()
        .defer(d3.json,'assets/data96.json')
        .defer(d3.json,'assets/data15.json')
        .await(dataloaded);

    drawAxis(); //drawAxis

    function dataloaded(err, data96, data15) {
        console.log(data96[0]);
        //console.log(joinData(data));
        var circleData96=[], circleData15=[];
        for (var id=1; id<101; id++){

            var circle96=[], circle15=[];

            Array.from(data96,function (t) {
                circle96.push(createCircleData(t, id));
            });

            circleData96.push({
                'year': '1996',
                'id': id,
                'data': circle96
            });

            Array.from(data15,function (t) {
                circle15.push(createCircleData(t, id));
            });

            circleData96.push({
                'year': '2015',
                'id': id,
                'data': circle15
            });
        }
        var allCircleData=circleData96.concat(circleData15);
        console.log(allCircleData);
        simulation= d3.forceSimulation(allCircleData);
        //drawChart(allCircleData );
        var universityId=2;


        d3.select('#container').classed('fixed', true);
        ForceLayout(allCircleData, universityId);

        //ScrollyTelling
        var controller = new ScrollMagic.Controller();

        var sceneA = new ScrollMagic.Scene({ triggerElement:'#trigger1', offset: -(document.documentElement.clientHeight/th), triggerHook: 0 }) // All races
            .on('start',function(){
                universityId=0; //BU

                ForceLayout(allCircleData, universityId);
            });

        var sceneB = new ScrollMagic.Scene({ triggerElement:'#trigger2', offset: -(document.documentElement.clientHeight/th), triggerHook: 0, reverse: true}) // All races - charter schools
            .on('start',function(){
                universityId=3; //Harvard
                ForceLayout(allCircleData, universityId);
            });

        var sceneC = new ScrollMagic.Scene({ triggerElement:'#trigger3', offset: -(document.documentElement.clientHeight/th), triggerHook: 0, reverse: true}) // All races - charter schools
            .on('start',function(){
                universityId=2;//NEU
                ForceLayout(allCircleData, universityId);
            });
        // var sceneD = new ScrollMagic.Scene({ triggerElement:'#trigger4', offset: -(document.documentElement.clientHeight/th), triggerHook: 0, reverse: true}) // All races - charter schools
        //     .on('start',function(){
        //         universityId=7; //MIT
        //         ForceLayout(allCircleData, universityId);
        //     });
        controller.addScene([sceneA, sceneB, sceneC]);


        var btn = d3.select('#trigger3')
            .selectAll('button')
            .data([1]);
        var btnEnter = btn
            .enter()
            .append('button')
            .attr('class','dropbtn')
            .text('Search another university');

        var dropdownMenu = d3.select('#trigger3')
            .selectAll('.dropdown-content')
            .data([1]);
        var dropdownDiv = dropdownMenu
            .enter()
            .append('div')
            .attr('class', 'dropdown-content')
            .attr('id','myDropdown')
            .attr('overflow-y','scroll');


        dropdownDiv
            .append('input')
            .attr('type','text')
            .attr('placeholder','search')
            .attr('id', 'myInput')
            .on('keyup', filterFunction);

        dropdownDiv.selectAll('.university')
            .data(data96)
            .enter()
            .append("a")
            .attr('class', 'university')
            .attr('"xlink:href', function (d) {
            return '#'+d.name
        })
            .text(function (d) {
                return d.name;
            })
            .on('click', function (d) {
                universityId=data96.indexOf(d); //MIT
                ForceLayout(allCircleData, universityId);
            });

        d3.select('.dropbtn').on('mouseover', myFunction);


        function myFunction() {
            document.getElementById("myDropdown").classList.toggle("show");
        }

        function filterFunction() {
            var input, filter, a, i, div;
            input = document.getElementById("myInput");
            filter = input.value.toUpperCase();
            div = document.getElementById("myDropdown");
            a = div.getElementsByTagName("a");
            for (i = 0; i < a.length; i++) {
                if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
                    a[i].style.display = "";
                } else {
                    a[i].style.display = "none";
                }
            }
        }







        function createCircleData (university, id) {
            //universities
            var black = university.black*100;
            var international = university.international*100;
            var white = university.white*100;
            var asian = university.asian*100;
            var hispanic = university.hispanic*100;
            var others = university.others*100;

            var obj={
                'name': university.name,
                'attr': 'others'
            };

            if(university.black*100>=id){
                obj.attr = 'black';
                return obj;
            } else if((black+international)>=id){
                obj.attr = 'international';
                return obj;
            }else if((black+international+white)>=id){
                obj.attr = 'white';
                return obj;
            }else if((black+international+white+hispanic)>=id){
                obj.attr = 'hispanic';
                return obj;
            }else if((black+international+white+hispanic+asian)>=id){
                obj.attr = 'asian';
                return obj;
            }else {
                obj.attr = 'others';
                return obj;
            }
        }


    }



    function ForceLayout(data, uId) {
        drawChart(data);

        var forceX= d3.forceX().x(function (d) {
            return scaleX(d.year);
        }).strength(0.1);


        var forceY = d3.forceY().y(function (d) {
            return scaleY(d.data[uId].attr.toUpperCase());
        }).strength(1.5);

        //var collide = d3.forceCollide(5)

        simulation
            .force("collide",d3.forceCollide(5).radius(6).strength(1.5) )
            .force("charge", d3.forceManyBody().strength(0.5))
            .force('y', forceY)
            .force('x', forceX)
            // .alphaTarget(0.3)
            // .restart()
            .restart()
            .alphaTarget(0.05)
            .on('tick', ticked);
        //return simulation;

        function ticked() {
            d3.selectAll('.circleNode')
                .attr('cx',function(d){
                    return (d.x)?(d.x):width })
                .attr('cy',function(d){ return (d.y)?(d.y):height/2 })
                .attr('fill', colorByRace);
        }
        function colorByRace(d) {
            return color[d.data[uId].attr.toUpperCase()];
        }
    }

    function drawChart(data) {
        console.log(data);

        var node = svg.selectAll('.node')
            .data([1]);

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node');

        var circles = nodeEnter.merge(node).selectAll('.circleNode')
            .data(data) //500 objects
            .enter();

        var circlesUpdate = circles
            .append('circle')
            .attr('class','circleNode');

        d3.selectAll('.circleNode')
            .attr('r', 5)
            .attr('transform','translate(230,0)');

        circles.exit().remove();

        d3.selectAll('.circleNode')
            .call(d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragend));
    }



    function joinData(data) { // all circles for all school
        var arr = [];
        for (var i =0; i<data.length; i++){
            arr = arr.concat(createCircleData(data[i]));
        }
        return arr;

    }
    function dragStarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function dragend(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }



    function attrInCategory(attr) {
        var inCategory = false;
        for (var i=0; i<axisData.length; i++){
            if(axisData[i].toLowerCase() == attr){
                inCategory = true;
            }
        }
        return inCategory;
    }

    function addAttrToCircles(data96, data15) {
        for( var i=0; i< data96.length; i++){
            data96[i].newattr = (data15[i])?data15[i].attr :'others';
            data96[i].newId= (data15[i])?data15[i].id : 1;
        }
        return data96;
    }

    function createCircleData (data) {
        var arr=[];
        for (var attr in data){
            if(attrInCategory(attr)){
                for(var j=0;j<data[attr]*100; j++){
                    arr.push( {
                        name: data.name,
                        attr: attr,
                        id: j+1
                    } );
                }
            }
        }
        return arr;
    }
    function drawAxis() {
        var axisCategory = d3.axisLeft()
            .scale(scaleY)
            .tickSize(-width);
        svg.append('g')
            .attr('class','categoryAxis')
            .attr('transform','translate(100,-40)')
            .style('stroke-dasharray', ('6, 3'))
            .call(axisCategory);

        var axisx = d3.axisTop()
            .scale(scaleX)
            .tickSize(-width);
        svg.append('g')
            .attr('class','xAxis')
            .attr('transform','translate(120,50)')
            .call(axisx);
    }
    function selectedSchool(str) {
        var selectedSchool=false;
        for( var i=0; i<axisYData.length; i++){
            if(axisYData[i] == str){
                selectedSchool = true;
            }
        }
        return selectedSchool;
    }




    // run code
    init();
})();
