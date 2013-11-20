function Dot(sequence, div, loc) {
    this.sequence = sequence;
    this.div = div;
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
};

function DotManager(aMap) {
    this.map = aMap;
    this.dots = [];
}

DotManager.prototype.addDot = function(loc) {
    var sequence = new Sequence('BlueDot_Flat', 90, 'BlueDot_', [60, 60]);
    var div = document.createElement('div');
    sequence.attachToDiv(div);
    sequence.startAnimating();
    var dot = new Dot(sequence, div, loc);
    this.dots.push(dot);
    $('#dotdiv').append($(div));
    dot.positionOnMap(this.map);
};

DotManager.prototype.handleResize = function() {
    for (var i = 0; i < this.dots.length; i++) {
        this.dots[i].positionOnMap(this.map);
    }
};

