var ExpiryManager = function ExpiryManager() {
    this._items = [];
};

ExpiryManager.prototype.register = function(id) {
    this._removeExistingItem(id);
    this._addItem(id);
};

ExpiryManager.prototype.collect = function(minimumAge) {
    if (typeof minimumAge === 'undefined') {
        return this._collectAll();
    }

    return this._collectOlderThan(minimumAge);
};

ExpiryManager.prototype._removeExistingItem = function(id) {
    this._items = this._items.filter(function(item) {
        return item.id !== id;
    });
};

ExpiryManager.prototype._addItem = function(id) {
    this._items.push({ id: id, updated: Date.now() });
};

ExpiryManager.prototype._collectAll = function() {
    var items = this._items;

    this._items = [];

    return items.map(this._mapToId);
};

ExpiryManager.prototype._collectOlderThan = function(minimumAge) {
    var items = this._items;
    var timestamp = Date.now();

    this._items = items.filter(function(item) {
        return timestamp - item.updated < minimumAge;
    });

    return items.filter(function(item) {
        return timestamp - item.updated > minimumAge;
    }).map(this._mapToId);
};

ExpiryManager.prototype._mapToId = function(item) {
    return item.id;
};
