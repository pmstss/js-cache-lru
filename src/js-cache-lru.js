(function (root, definition) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], definition);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but only CommonJS-like
        // environments that support module.exports, like Node.
        module.exports = definition();
    } else if (root) {
        // Browser globals (root is window)
        root.LRUCache = definition();
    }
})(typeof window !== 'undefined' ? window : null, function () {
    'use strict';

    var DLL = require('./dl-list');

    return function (capacity, cleanupTime, expirationTime) {
        var CLEANUP_TIME = cleanupTime || 0;    // no cleanup by default
        var EXPIRATION_TIME = expirationTime || 0;    // no expiration by default
        var CAPACITY = capacity || 256; // capacity is 256 by default
        var _referencesCleanup = false;

        var _linkedList = new DLL();
        var _hash = {};
        var _cleanupTimer;

        function _clearCleanupTimer() {
            if (_cleanupTimer) {
                clearTimeout(_cleanupTimer);
                _cleanupTimer = null;
            }
        }

        function _clear() {
            _hash = {};
            if (_referencesCleanup) {
                _linkedList.clear();
            } else {
                _linkedList = new DLL();
            }
            _clearCleanupTimer();
        }

        function _resetCleanupTimer() {
            _clearCleanupTimer();

            if (CLEANUP_TIME !== 0) {
                _cleanupTimer = setTimeout(_clear, CLEANUP_TIME);
            }
        }

        function _refreshNode(node) {
            node.lastVisitTime = Date.now();
            _linkedList.moveToHead(node.listNode);
            _resetCleanupTimer();
        }

        function _isExpiredNode(node) {
            var expirationTime = node.hasOwnProperty(expirationTime) ? node.expirationTime : EXPIRATION_TIME;
            return expirationTime !== 0 && Date.now() - node.lastVisitTime > expirationTime;
        }

        function _removeDirectly(key) {
            _linkedList.remove(_hash[key].listNode);
            delete _hash[key];
        }

        /*** LRUCache ***/

        function LRUCache() {
        }

        LRUCache.prototype.enableReferencesCleanup = function () {
            _referencesCleanup = true;
        };

        LRUCache.prototype.disableReferencesCleanup = function () {
            _referencesCleanup = false;
        };

        Object.defineProperty(LRUCache.prototype, 'capacity', {
            get: function () {
                return CAPACITY;
            }
        });

        Object.defineProperty(LRUCache.prototype, 'expirationTime', {
            get: function () {
                return EXPIRATION_TIME;
            }
        });

        Object.defineProperty(LRUCache.prototype, 'cleanupTime', {
            get: function () {
                return CLEANUP_TIME;
            }
        });

        LRUCache.prototype.remove = function (key) {
            if (this.has(key)) {
                _removeDirectly(key);
            }
        };

        LRUCache.prototype.clear = _clear;

        LRUCache.prototype.set = function (key, value) {
            var node = _hash[key];
            if (node) {
                node.value = value;
                _refreshNode(node);
            } else {
                if (this.length === CAPACITY) {
                    var lastNode = _linkedList.removeFromTail();
                    delete _hash[lastNode.key];
                }
                var data = {
                    key: key,
                    value: value
                };
                data.listNode = _linkedList.append(data);
                _hash[key] = data;
                _refreshNode(data);
            }
        };

        LRUCache.prototype.get = function (key) {
            if (!this.has(key)) {
                return;
            }
            return _hash[key].value;
        };

        LRUCache.prototype.has = function (key) {
            var exist = _hash.hasOwnProperty(key);
            if (!exist) {
                return false;
            }

            var node = _hash[key];
            if (_isExpiredNode(node)) {
                _removeDirectly(key);
                return false;
            }
            _refreshNode(node);
            return true;
        };

        Object.defineProperty(LRUCache.prototype, 'length', {
            get: function () {
                return _linkedList.length;
            }
        });

        // following methods are pretty slow, but normally are used for debugging/tests only
        Object.defineProperty(LRUCache.prototype, 'keys', {
            get: function () {
                return Object.keys(_hash);
            }
        });

        Object.defineProperty(LRUCache.prototype, 'values', {
            get: function () {
                return this.keys.reduce(function (res, key) {
                    var value = this.get(key);
                    // check if cache entry was expired on last get
                    if (typeof value !== 'undefined') {
                        res.push(value);
                    }
                    return res;
                }.bind(this), []);
            }
        });

        return new LRUCache();
    };
});