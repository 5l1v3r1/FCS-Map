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
    this.index = 0;
    this.animateId = 0;
    this.dimensions = dimensions;
    this.canvases = [];
    this.isRunning = false;
}

Sequence.prototype.addCanvas = function(canvas) {
    this.canvases.push(canvas);
};

Sequence.prototype.removeCanvas = function(canvas) {
    for (var i = 0; i < this.canvases.length; i++) {
        if (this.canvases[i] == canvas) return this.canvases.splice(i, 1);
    }
};

Sequence.prototype.startAnimating = function() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick(++this.animateId);
};

Sequence.prototype.stopAnimating = function() {
    this.animateId++;
    this.isRunning = false;
};

Sequence.prototype.tick = function(anId) {
    if (anId != this.animateId) return;
    var image = this.images[this.index++];
    for (var i = 0; i < this.canvases.length; i++) {
        var ctx = this.canvases[i].getContext('2d');
        var width = this.canvases[i].width;
        var height = this.canvases[i].height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
    }
    setTimeout(this.tick.bind(this, ++this.animateId), 50);
    if (this.index >= this.images.length) this.index = 0;
};

