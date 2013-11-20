function Sequence(dir, count, prefix, dimensions) {
    var images = [];
    for (var i = 0; i < count; i++) {
        var numStr = '' + i;
        while (numStr.length < 5) numStr = '0' + numStr;
        var aFile = dir + '/' + prefix + numStr + '.png';
        var image = new Image();
        image.src = aFile;
        images.push(image);
    }
    this.images = images;
    this.animateDiv = null;
    this.index = 0;
    this.animateId = 0;
    this.dimensions = dimensions;
}

Sequence.prototype.attachToDiv = function(div) {
    this.animateDiv = div;
};

Sequence.prototype.startAnimating = function() {
    this.tick(++this.animateId);
};

Sequence.prototype.stopAnimating = function() {
    this.animateId++;
};

Sequence.prototype.tick = function(anId) {
    if (anId != this.animateId) return;
    var obj = $(this.animateDiv);
    obj.empty();
    obj.append($(this.images[this.index++]));
    this.images[this.index - 1].width = this.dimensions[0];
    this.images[this.index - 1].height = this.dimensions[1];
    setTimeout(this.tick.bind(this, ++this.animateId), 50);
    if (this.index >= this.images.length) this.index = 0;
};

