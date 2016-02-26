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

    var createNode = function (data) {
        return {
            data: data
        };
    };

    var DoubleLinkedList = function () {
        var _head = null;
        var _tail = null;
        var _length = 0;

        function DLL() {
        }

        DLL.prototype.remove = function (node) {
            var key = node.data.key;
            if (node.prev) {
                node.prev.next = node.next;
            } else {
                _tail = node.next;
                if (_tail) {
                    delete _tail.prev;
                }
            }
            if (node.next) {
                node.next.prev = node.prev;
            } else {
                _head = node.prev;
                if (_head) {
                    delete _head.next;
                }
            }

            --_length;
            return key;
        };

        DLL.prototype.removeLast = function () {
            return _tail && this.remove(_tail);
        };

        DLL.prototype.insertHead = function (node) {
            if (_head) {
                _head.next = node;
                node.prev = _head;
                _head = node;
            } else {
                _head = _tail = node;
            }
            ++_length;
        };

        DLL.prototype.moveToHead = function (node) {
            this.remove(node);
            this.insertHead(node);
        };

        DLL.prototype.clear = function () {
            var node = _tail;
            while (node && node.next) {
                var tmp = node.next;
                node.prev = null;
                node.next = null;
                node = tmp;
            }
            _head = _tail = null;
            _length = 0;
        };

        Object.defineProperty(DLL.prototype, 'length', {
            get: function () {
                return _length;
            }
        });

        return new DLL();
    };

    return function (capacity, maxAge) {
        var MAX_AGE = maxAge || 0;    // no expiration by default
        var CAPACITY = capacity || 256; // capacity is 100 by default

        var _linkedList = new DoubleLinkedList();
        var _hash = {};

        function _refreshNode(node) {
            node.data.lastVisitTime = Date.now();
            _linkedList.moveToHead(node);
        }

        function _isExpiredNode(node) {
            return MAX_AGE !== 0 && Date.now() - node.data.lastVisitTime > MAX_AGE;
        }

        function _removeDirectly(key) {
            _linkedList.remove(_hash[key]);
            delete _hash[key];
        }

        function LRUCache() {
        }

        Object.defineProperty(LRUCache.prototype, 'capacity', {
            get: function () {
                return CAPACITY;
            }
        });

        Object.defineProperty(LRUCache.prototype, 'maxAge', {
            get: function () {
                return MAX_AGE;
            }
        });

        LRUCache.prototype.remove = function (key) {
            if (this.has(key)) {
                _removeDirectly(key);
            }
        };

        LRUCache.prototype.clear = function () {
            _hash = {};
            _linkedList.clear();
        };

        LRUCache.prototype.set = function (key, value) {
            var node = _hash[key];
            if (node) {
                node.data.value = value;
                _refreshNode(node);
            } else {
                if (this.length === CAPACITY) {
                    var lastKey = _linkedList.removeLast();
                    delete _hash[lastKey];
                }
                node = createNode({
                    key: key,
                    value: value,
                    lastVisitTime: Date.now()
                });
                _linkedList.insertHead(node);
                _hash[key] = node;
            }
        };

        LRUCache.prototype.get = function (key) {
            if (!this.has(key)) {
                return;
            }
            return _hash[key].data.value;
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