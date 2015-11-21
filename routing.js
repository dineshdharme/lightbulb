var graph = new joint.dia.Graph();

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 1000,
    height: 600,
    gridSize: 10,
    model: graph,
    interactive : false,

});

var width = 70, height = 70;
var gap = 10;
var startX = 50, startY = 50;

var bulb = new joint.shapes.basic.Rect({
    position: { x: startX, y: startX },
    size: { width: width, height: height },
    attrs: {
        rect: {
            fill: {
                type: 'linearGradient',
                stops: [
                    { offset: '0%', color: '#f7a07b' },
                    { offset: '100%', color: '#fe8550' }
                ],
                attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
            },
            stroke: '#ed8661',
            'stroke-width': 2
        },
        text: {
            text: 'Bulb',
            fill: '#f0f0f0',
            'font-size': 18,
            'font-weight': 'lighter',
            'font-variant': 'small-caps'
        }
    }
});





var obstacle = bulb.clone().translate(300, 100).attr({
    text: { 
        text: 'Switch',
        fill: '#eee'
    },
    rect: {
        fill: {
            stops: [{ color: '#b5acf9' }, { color: '#9687fe' }]
        },
        stroke: '#8e89e5',
        'stroke-width': 2
    }
});



// graph.addCells(obstacles).addCells([bulb]);


var map1 = [ [0, 1, 1, 1 , 1, 0],
             [1, 2, 0, 0 , 0, 1], 
             [0, 1, 1, 1 , 1, 0] ]

var map2 = [ [0, 1, 1, 0 ],
             [1, 2, 0, 1 ],
             [1, 0, 0, 1 ], 
             [0, 1, 1, 0 ] ]

var mapGlobal ;

function createGrid( gridmap ) {
    // add 'live' class to the element if there is a positive signal
    var newCells = []

    // assign map to temp variable
    tempmap = gridmap

    for (i = 0; i < tempmap.length; ++i) {
        entry = tempmap[i];
        for (j = 0; j < entry.length; ++j) {
        // Do something with entry[j]

        // if tempmap[i][j] = 1

        if ( tempmap[i][j] === 1 ){

                var obstacle = bulb.clone().translate((height+gap)*j, (width+gap)*i );
                obstacle.prop('state', 'off');
                obstacle.prop('ele', 'bulb');
                newCells.push(obstacle);
        } // end if for 1

        // if tempmap[i][j] = 2

        if ( tempmap[i][j] === 2 ){

                var obstacle = bulb.clone().translate((height+gap)*j, (width+gap)*i ).attr({
                            text: { 
                                text: 'Switch',
                                fill: '#eee'
                            },
                            rect: {
                                fill: {
                                    stops: [{ color: '#b5acf9' }, { color: '#9687fe' }]
                                },
                                stroke: '#8e89e5',
                                'stroke-width': 2
                            }
                        });
                obstacle.prop('ele', 'switch');
                newCells.push(obstacle);
        } // end if for 1


        } // inner for
    } // outer for

    
    

    graph.addCells(newCells);
    

    }   

// Turn all element static i.e. non-draggable.

function setMap(gridmap)
{
    mapGlobal = gridmap;
}


setMap(map1);

createGrid(mapGlobal);
// row, column
directionMap = {'left' : [0,-1], 'right':[0,1], 'up' : [-1,0], 'down':[1,0] }


function availableCell( pos , directionVector ){

        console.log("Pos = " + pos);
        console.log("DV = " + directionVector);
        
        if( directionVector[0]  === 0){ 
            // this means either left or right key is pressed
            // so only x bounds need to be checked , y remains constant
            if  ( pos[1] + directionVector[1] >=0  && pos[1] + directionVector[1] < mapGlobal[pos[0]].length  ){

                if (mapGlobal[ pos[0] + directionVector[0] ][ pos[1] + directionVector[1] ] === 0){
                    return { 1 : [ pos[0] + directionVector[0] ,pos[1] + directionVector[1]] }
                }
            }

        }

        if( directionVector[1]  === 0){ 
            // this means either left or right key is pressed
            // so only x bounds need to be checked , y remains constant
            if  ( pos[0] + directionVector[0] >=0  && pos[0] + directionVector[0] < mapGlobal.length  ){

                if (mapGlobal[ pos[0] + directionVector[0] ][ pos[1] + directionVector[1] ] === 0){
                    return { 1 : [ pos[0] + directionVector[0] ,pos[1] + directionVector[1]] }
                }
            }

        }

        return { 0 : []};
}

function getCurrPos() {
    
    console.log("in getCurrPos");
    for (var i = mapGlobal.length - 1; i >= 0; i--) {
        console.log("in outer for");
        entry = mapGlobal[i];
        for (var j = entry.length - 1; j >= 0; j--) {
            console.log("in inner for");
            if (entry[j] === 2 ){
                console.log(i+" "+j);
                return [i,j];
                    }

            }
    
    }

    return [];

}

function getCenteredPoint( posMap ){

    return [ startX + (width+gap)*posMap[1] + width/2, startY + (height+gap)*posMap[0] + height/2  ]

}

function getTopLeftCornerPoint( posMap ){

    return [  startX + (width+gap)*posMap[1] , startY + (height+gap)*posMap[0] ]

}


function getElementContainingPoint( posAbs ){

        allE = graph.getElements(); 
        
        console.log("abspos " + posAbs);

        for(var i = 0; i < allE.length ; i++){
            console.log(allE[i].id);
            console.log( "i " + allE[i].getBBox() );
            if ( allE[i].getBBox().containsPoint( g.point(posAbs[0], posAbs[1]) )  ) {

                return allE[i] ; 
            }

        }

}

function setPosition(cell, posAbs){

    console.log("cell " + cell);
    console.log("posAbs " + posAbs);
    
    //cell.set('position', { x: posAbs[0], y: posAbs[1] })
    cell.position(posAbs[0], posAbs[1] )

}

function moveSwitch( direction ) {

    

    var currPos = getCurrPos();
    
    console.log (currPos);  
    console.log (mapGlobal);

    if( currPos === []){
            alert(' switch not detected');
            return ;
        }

    
    var newPos = availableCell(currPos , directionMap[direction]);

    console.log (newPos);    

    // newPos is dictionary and we are checking if key is present
    if ( 1 in newPos){
        nPos = newPos[1] ;

        mapGlobal[currPos[0]][currPos[1]] = 0;
        mapGlobal[nPos[0]][nPos[1]] = 2;
        setPosition( getElementContainingPoint( getCenteredPoint(currPos) ) , getTopLeftCornerPoint(nPos)); 
        
    }


}

function getNeighbours( point ){
        var neighbourlist = [];
        for (var key in directionMap){
                //key will be -> 'id'
                //dictionary[key] -> 'value'
                value = directionMap[key];
                neighbourlist.push( getElementContainingPoint( [ point[0] + value[0]*width , point[1] + value[1]*height ] ) );


            }
        console.log("neighbourlist =  " + neighbourlist); 
        return neighbourlist;

}

function changeStates(){

        var currPos = getCurrPos();
        var center  = getCenteredPoint(currPos);
        var neighbours = getNeighbours(center);

        for (var index in neighbours){

            ele = neighbours[index]
            
            console.log("neighbour " + ele);
            
            if (typeof ele !== 'object'){
                 console.log(ele + " not an object " );
                 continue;
            }

            if (ele.prop("ele") === 'bulb'){

                if (ele.prop("state") === 'off'){
                    
                    console.log("off state found ");
                     ele.prop('state', 'on').attr({
                                    
                                    rect: {
                                        fill: {
                                            stops: [{ color: '#ff11f9' }, { color: '#4432fe' }]
                                        },
                                        stroke: '#8e89e5',
                                        'stroke-width': 2
                                    }
                                });
                        
                }
                else {
                    // state is already 'on' and we need to turn it off
                    console.log("on state found ");
                    ele.prop('state', 'off').attr({
                                    
                                    rect: {
                                        fill: {
                                            stops: [{ color: '#e34ff9' }, { color: '#ab3f12' }]
                                        },
                                        stroke: '#8e89e5',
                                        'stroke-width': 2
                                    }
                                });
                }
            }
        }

    }


document.onkeydown = function(e) {

    
    switch (e.keyCode) {
        case 37:
            moveSwitch('left');
            break;
        case 38:
            moveSwitch('up');
            break;
        case 39:
            moveSwitch('right');
            break;
        case 40:
            moveSwitch('down');
            break;
        
    }

    if (e.ctrlKey){
        
            console.log("ctrlkey has been pressed");
            changeStates();
    }

};






