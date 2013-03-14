var DIContainer = function DIContainer(definition) {
    this._definition = definition;
    this._sharedInstances = {};
};

DIContainer.prototype.get = function(key) {
    this._testKeyExists(key);

    if (this._isSharedResource(key)) {
        return this._handleSharedResource(key);
    }

    if (typeof this._definition[key] !== 'function') {
        return this._definition[key];
    }

    return this._definition[key].call(undefined, this);
};

DIContainer.prototype._isSharedResource = function(key) {
    if (typeof this._definition[key] !== 'object') {
        return false;
    }

    if (typeof this._definition[key]._shared !== 'function') {
        return false;
    }

    return true;
};

DIContainer.prototype._handleSharedResource = function(key) {
    var sharedInstances = this._sharedInstances;

    if (typeof sharedInstances[key] !== 'undefined') {
        return this._sharedInstances[key];
    }

    sharedInstances[key] = this._definition[key]._shared.call(undefined, this);
    return sharedInstances[key];
};

DIContainer.prototype._testKeyExists = function(key) {
    if (typeof this._definition[key] === 'undefined') {
        throw new Error('Key "' + key + '" has not been defined');
    }
};