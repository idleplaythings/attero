var ExpiryManager = function ExpiryManager() {
    this._items = [];
};

ExpiryManager.prototype.register = function(id) {
    this._items = this._items.filter(function(item) {
        return item.id !== id;
    });

    this._items.push({
        id: id,
        updated: Date.now()
    });
};

ExpiryManager.prototype.collect = function(minimumAge) {
    var collect;

    if (typeof minimumAge === 'undefined') {
        collect = this._items.map(function(item) { return item.id; });
        this._items = [];
        return collect;
    }

    var timestamp = Date.now();

    this._items.map(function(item) {
        item.collect = timestamp - item.updated > minimumAge;
    });

    collect = this._items.filter(function(item) { return item.collect; }).map(function(item) { return item.id; });
    this._items = this._items.filter(function(item) { return item.collect === false; });

    return collect;
};
