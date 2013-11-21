function Dot(canvas, blurb, loc) {
    this.canvas = canvas;
    this.blurb = blurb;
    this.loc = loc;
}

Dot.prototype.positionOnMap = function(aMap) {
    var pos = aMap.pagePoint(this.loc);
    var scale = aMap.getScale();
    var size = scale * 7;
    var xVal = pos[0] - size / 2;
    var yVal = pos[1] - size / 2;
    $(this.canvas).css({'left': Math.round(xVal) + 'px',
                     'top': Math.round(yVal) + 'px',
                     'position': 'fixed'});
    this.canvas.width = size;
    this.canvas.height = size;
    // setup blurb
    $(this.blurb).css({'font-size': Math.round(size * 0.6) + 'px'});
    $(this.blurb).css({'left': Math.round(xVal + size) + 'px',
                       'top': Math.round(pos[1] - $(this.blurb).innerHeight() / 2) + 'px',
                       'position': 'fixed',
                       'text-shadow': '0px 0px ' + Math.round(size / 2) + 'px rgba(0, 0, 0, 0.7)'});
};

function DotManager(aMap) {
    this.map = aMap;
    this.dots = [];
    this.sequence = new Sequence('BlueDot_Flat', 90, 'BlueDot_', [40, 40]);
    this.sequence.startAnimating();
}

DotManager.prototype.addDot = function(loc, html) {
    // create dot div
    var canvas = document.createElement('canvas');
    $('#dotdiv').append($(canvas));
    this.sequence.addCanvas(canvas);

    // create blurb div
    var blurb = document.createElement('div');
    blurb.innerHTML = html;
    $(blurb).css({'color': '#0000FF', 'font-family': 'Arial'});
    $('#dotdiv').append($(blurb));

    var dot = new Dot(canvas, blurb, loc);
    this.dots.push(dot);
    dot.positionOnMap(this.map);
    return dot;
};

DotManager.prototype.handleResize = function() {
    for (var i = 0; i < this.dots.length; i++) {
        this.dots[i].positionOnMap(this.map);
    }
};

