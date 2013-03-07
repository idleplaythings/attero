var DIContainer = function DIContainer(definition) {
    this._definition = definition;
};

DIContainer.prototype.get = function(key) {
    this._testKeyExists(key);

    if (typeof this._definition[key] !== 'function') {
        return this._definition[key];
    }

    return this._definition[key].call(undefined, this);
};

DIContainer.prototype._testKeyExists = function(key) {
    if (typeof this._definition[key] === 'undefined') {
        throw new Error('Key "' + key + '" has not been defined');
    }
};