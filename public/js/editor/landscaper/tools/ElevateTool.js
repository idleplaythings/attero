'use strict';

var ElevateTool = function ElevateTool(id, src, title, brush) {
    this._brush = brush;
    LandscapingTool.call(this, id, src, title);
}
 
ElevateTool.prototype = Object.create(LandscapingTool.prototype);

ElevateTool.prototype.processTile = function(tile) {
    var affectedTiles = this._brush.getAffectedTiles(tile);
}
