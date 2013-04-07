var Landscaper = function Landscaper() {
    this._tool = null;
};

Landscaper.prototype.setTool = function(tool) {
    this._tool = tool;
};

Landscaper.prototype.unsetTool = function(tool) {
    this._tool = null;
};

Landscaper.prototype.getTool = function() {
    return this._tool;
};

Landscaper.prototype.processTile = function(tile) {
    this._canProcessTiles();
    this._tool.processTile(tile);
};

Landscaper.prototype._canProcessTiles = function() {
    if (this._tool === null) {
        throw Error("No landscaping tool set");
    }
};