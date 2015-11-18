var graph = new joint.dia.Graph;

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 800,
        height: 400,
        snapLinks: true,
        model: graph,
        gridSize: 10,
        

    });

    var min = 20;
    var max = 100;
    var rect = new joint.shapes.basic.Rect({
        position: { x: 100, y: 30 },
        size: { width: 100, height: 30 },
        attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
    });

    var cir = new joint.shapes.basic.Circle({
        position: { x: 100, y: 30 },
        size: { radius: 50 },
        attrs: { circle: { fill: 'red' }, text: { text: 'bulb', fill: 'black' } }
    });

    var rect2 = rect.clone();
    rect2.translate(300);

    var link = new joint.dia.Link({
        source: { id: rect.id },
        target: { id: rect2.id }
    });

    //graph.addCells([rect, rect2, link]);


    var sw = new joint.shapes.devs.Model({
    position: { x: 50, y: 50 },
    size: { width: 60, height: 45 },
    
    outPorts: ['out'],
    attrs: {
        '.label': { text: 'S',  },
        rect: { fill: '#2ECC71' },
        
        '.outPorts circle': { fill: '#E74C3C' }
    }
    });
    
    var lb = new joint.shapes.devs.Model({
    position: { x: 50, y: 50 },
    size: { width: 60, height: 45 },
    
    inPorts: ['in',],
    
    attrs: {
        '.label': { text: 'L',  },
        rect: { fill: '#DE1171' },
        
        '.inPorts circle': { fill: '#E74C3C' }
    }
    });
    

    graph.addCell(sw);

    graph.addCell(lb);

   function addSwitch() {
    // add 'live' class to the element if there is a positive signal
    var rect2 = sw.clone();

    var x = Math.random() * (max - min) + min;
    rect2.translate(x);

    graph.addCells([rect2]);
    }

    function addBulb() {
    // add 'live' class to the element if there is a positive signal
    var cir2 = lb.clone();

    var x = Math.random() * (max - min) + min;


    cir2.translate(x);

    
    graph.addCells([cir2]);
    }   


    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    paper.on('cell:pointerclick', 
    function(cellView, evt, x, y) { 
        
        
        tempLinks = graph.getConnectedLinks(cellView.model  );

        console.log(tempLinks);
        console.log(tempLinks[0]);
        tempColor = getRandomColor();
        for (var i = tempLinks.length - 1; i >= 0; i--) {
            cellid = tempLinks[i].get('target').id

            graph.getCell(cellid).attr({    
                rect: { fill: tempColor },
                });   
            
        };
        

    }
    );


    graph.on('change:source change:target', function(link) {
    var sourcePort = link.get('source').port;
    var sourceId = link.get('source').id;
    var targetPort = link.get('target').port;
    var targetId = link.get('target').id;

    var m = [
        'The port <b>' + sourcePort,
        '</b> of element with ID <b>' + sourceId,
        '</b> is connected to port <b>' + targetPort,
        '</b> of elemnt with ID <b>' + targetId + '</b>'
    ].join('');
    
    out(m);
    });

    function out(m) {
    $('#paper-link-out').html(m);
    }

 