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

    var _createNode = function (data) {
        return {
            data: data
        };
    };

    /*
     * ..........node.prev...node...node.next...........
     * tail ....................................... head
     */

    return function () {
        var _head = null;
        var _tail = null;
        var _length = 0;

        function DLL() {
        }

        DLL.prototype.append = function (data) {
            var node = _createNode(data);
            if (_head) {
                _head.next = node;
                node.prev = _head;
                _head = node;
            } else {
                _head = _tail = node;
            }
            ++_length;
            return node;
        };

        DLL.prototype.remove = function (node) {
            if (node.prev) {
                node.prev.next = node.next;
            } else {
                _tail = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            } else {
                _head = node.prev;
            }

            delete node.prev;
            delete node.next;

            --_length;
            return node.data;
        };

        DLL.prototype.removeFromTail = function () {
            return _tail && this.remove(_tail);
        };

        DLL.prototype.removeFromHead = function () {
            return _head && this.remove(_head);
        };

        DLL.prototype.moveToHead = function (node) {
            this.remove(node);
            this.append(node);
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

        Object.defineProperty(DLL.prototype, 'tail', {
            get: function () {
                return _tail;
            }
        });

        Object.defineProperty(DLL.prototype, 'head', {
            get: function () {
                return _head;
            }
        });

        return new DLL();
    };
});