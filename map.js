function generateChildren(elem) {
    if (elem.children) return;
    elem.children = [];
    for (var i = 0; i < elem.childNodes.length; i++) {
        var node = elem.childNodes[i];
        if (node.nodeName == '#text') continue;
        generateChildren(node);
        elem.children.push(node);
    }
}

function VectorMap(embed) {
    this.embed = embed;
    this.svg = this.embed.getSVGDocument();
    generateChildren(this.root());
}

VectorMap.prototype.root = function() {
    return this.svg ? this.svg.rootElement : null;
};

VectorMap.prototype.size = function() {
    if (!this.root()) return null;
    var viewBox = this.root().viewBox;
    return viewBox.baseVal;
};

VectorMap.prototype.layout = function(width, height) {
    var root = this.root();
    var svgSize = this.size();
    if (height / width > svgSize.height / svgSize.width) {
        root.setAttribute('width', width);
        root.setAttribute('height', width * (svgSize.height / svgSize.width));
    } else {
        root.setAttribute('height', height);
        root.setAttribute('width', height * (svgSize.width / svgSize.height));
    }
};

VectorMap.prototype.setColor = function(building, color, _field) {
    var layer = this.getBuildings()[building];
    if (!layer) throw new Error('no such building: ' + building);
    var element = this.root().getElementById(layer);
    if (!element) return;
    if (building == 'track') {
        element.children[0].children[0].setAttribute('fill', color);
        element.children[0].children[0].setAttribute('stroke', 'none');
        element.children[1].children[0].setAttribute('fill', _field);
        element.children[1].children[0].setAttribute('stroke', 'none');
    } else {
        // set color of all children
        for (var i = 0; i < element.children.length; i++) {
            element.children[i].setAttribute('fill', color);
            element.children[i].setAttribute('stroke', 'none');
        }
    }
    element.setAttribute('fill', color);
};

VectorMap.prototype.setPathColor = function(color) {
    this.root().getElementById('path').children[0].setAttribute('fill', color);
    this.root().getElementById('path').children[0].setAttribute('stroke', color);
    var oval = this.root().getElementById('Oval');
    for (var i = 0; i < oval.children.length; i++) {
        var child = oval.children[i];
        if (child.tagName == 'g') {
            child.children[0].setAttribute('stroke', color);
            child.children[1].setAttribute('fill', color);
        } else {
            child.setAttribute('stroke', color);
        }
    }
};

VectorMap.prototype.setParkingColor = function(bgcolor, islandColor) {
    var lot = this.root().getElementById('parking_outline');
    var islands = this.root().getElementById('parking_lot');
    lot.children[0].setAttribute('fill', bgcolor);
    lot.children[0].setAttribute('stroke', 'none');
    for (var i = 0; i < islands.children.length; i++) {
        islands.children[i].setAttribute('fill', islandColor);
        islands.children[i].setAttribute('stroke', 'none');
    }
};

VectorMap.prototype.getBuildings = function() {
    return {'parking': 'parking_lot',
            'track': 'track',
            'oval': 'Oval',
            'baseball-soccer-field': 'Baseball_Soccer_field',
            'lacrosse-field': 'Lacrosse_Field',
            'middle-school': 'Middle_School',
            'library': 'Library',
            'shallcross': 'Shallcross',
            'main': 'Main',
            'language': 'Language',
            'fcc': 'FCC',
            'shimada': 'Shimada',
            'city-ave-field': 'city_ave_field',
            'field-hockey-field': 'field_hockey',
            'tennis': 'Lacrosse_Field_4_',
            'baseball-soccer-field-2': 'Lacrosse_Field_3_'
            };
};

VectorMap.prototype.buildingLocation = function(building) {
    var locations = {
        'track': [96, 82],
        'tennis': [173, 67],
        'fcc': [131, 98],
        'shimada': [145, 75],
        'language': [116, 116],
        'city-ave-field': [105, 171],
        'library': [162, 100],
        'middle-school': [174, 90],
        'shallcross': [170, 121],
        'oval': [147, 107],
        'field-hockey-field': [91, 127],
        'lacrosse-field': [43, 69],
        'baseball-soccer-field': [28, 38],
        'parking': [153, 153],
        'baseball-soccer-field-2': [125, 62],
        'main': [137, 133]
    }
    return locations[building] || null;
};

VectorMap.prototype.getBuildingTitle = function(building) {
    var mapping = {
        'fcc': 'FCC',
        'field-hockey-field': 'Field Hockey',
        'city-ave-field': 'City Ave. Field',
        'baseball-soccer-field-2': 'Softball/Boys Soccer',
        'baseball-soccer-field': 'Baseball/Girls Soccer'
    };
    if (!mapping[building]) {
        var comps = building.split('-');
        var newStr = '';
        for (var i = 0; i < comps.length; i++) {
            var word = comps[i];
            word = word[0].toUpperCase() + word.substring(1);
            newStr += (i ? ' ' : '') + word;
        }
        return newStr;
    }
    return mapping[building];
};

VectorMap.prototype.getScale = function() {
    return $(this.embed).width() / this.size().width;
};

VectorMap.prototype.pagePoint = function(localPoint) {
    var object = $(this.embed);
    var scale = this.getScale();
    var offset = object.offset();
    return [localPoint[0] * scale + offset.left,
            localPoint[1] * scale + offset.top];
};

