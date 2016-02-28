var LRUCache = require('./src/js-cache-lru');

console.log(process.memoryUsage());

(function () {
    'use strict';

    function randomString(len) {
        var str = '';
        for (var i = 0; i < len; ++i) {
            str += String.fromCharCode(Math.round(Math.random(100)));
        }
        return str;
    }

    function addElements(cache, size) {
        for (var i = 0; i < size; ++i) {
            cache.set(randomString(512), randomString(1024));
        }
        return cache;
    }

    function testNonLeastRecentlyUsedCleaning() {
        var cache = new LRUCache(100);
        var i = 0;

        while (true) {
            addElements(cache, Math.round(Math.random() * 100));

            if (++i % 100 === 0) {
                console.log('%o iterations done, memory usage: %o', i, process.memoryUsage());
            }
        }
    }

    function testCacheAutoCleanup() {
        var i = 0;
        var caches = [];

        setInterval(function () {
            var cache = new LRUCache(100, 20);
            addElements(cache, Math.round(Math.random() * 100));

            if (caches.length > 100) {
                caches.splice(0, 100);
            }
            caches.push(cache);

            if (++i % 100 === 0) {
                console.log('%o iterations done, memory usage: %o', i, process.memoryUsage());
            }
        }, 30);
    }

    testCacheAutoCleanup();
})();