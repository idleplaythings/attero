'use strict';

var LandscapingTool = function LandscapingTool(id, src, title) {
    this._id = id;
    this._src = src;
    this._title = title;
}

LandscapingTool.prototype.getId = function() {
    return this._id;
}

LandscapingTool.prototype.getTitle = function() {
    return this._title;
}

LandscapingTool.prototype.getSrc = function() {
    return this._src;
}

LandscapingTool.prototype.processTile = function(tile) {
    return null;
}