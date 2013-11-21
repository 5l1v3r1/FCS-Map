function Dot(sequence, div, blurb, loc) {
    this.sequence = sequence;
    this.div = div;
    this.blurb = blurb;
    this.loc = loc;
}

Dot.prototype.positionOnMap = function(aMap) {
    var pos = aMap.pagePoint(this.loc);
    var scale = aMap.getScale();
    this.sequence.dimensions = [scale * 7, scale * 7];
    var xVal = pos[0] - this.sequence.dimensions[0] / 2;
    var yVal = pos[1] - this.sequence.dimensions[1] / 2;
    $(this.div).css({'left': Math.round(xVal) + 'px',
                     'top': Math.round(yVal) + 'px',
                     'position': 'fixed'});
    // setup blurb
    $(this.blurb).css({'font-size': Math.round(this.sequence.dimensions[0] * 0.6) + 'px'});
    $(this.blurb).css({'left': Math.round(xVal + this.sequence.dimensions[0]) + 'px',
                       'top': Math.round(pos[1] - $(this.blurb).innerHeight() / 2) + 'px',
                       'position': 'fixed',
                       'text-shadow': '0px 0px ' + Math.round(this.sequence.dimensions[0] / 2) + 'px rgba(0, 0, 0, 0.7)'});
};

function DotManager(aMap) {
    this.map = aMap;
    this.dots = [];
}

DotManager.prototype.addDot = function(loc, html) {
    var sequence = new Sequence('BlueDot_Flat', 90, 'BlueDot_', [60, 60]);

    // create dot div
    var div = document.createElement('div');
    sequence.attachToDiv(div);
    sequence.startAnimating();
    $('#dotdiv').append($(div));

    // create blurb div
    var blurb = document.createElement('div');
    blurb.innerHTML = html;
    $(blurb).css({'color': '#0000FF', 'font-family': 'Arial'});
    $('#dotdiv').append($(blurb));

    var dot = new Dot(sequence, div, blurb, loc);
    this.dots.push(dot);
    dot.positionOnMap(this.map);
    return dot;
};

DotManager.prototype.handleResize = function() {
    for (var i = 0; i < this.dots.length; i++) {
        this.dots[i].positionOnMap(this.map);
    }
};

