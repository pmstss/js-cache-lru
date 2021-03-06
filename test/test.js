(function () {
    'use strict';

    //jshint mocha:true

    var expect = require('expect.js');
    var LRUCache = require('../src/js-cache-lru');

    var data = [{
        key: 'key1',
        value: 'value1'
    }, {
        key: 'key2',
        value: 'value2'
    }, {
        key: 'key3',
        value: 'value3'
    }];

    describe('js-cache-lru', function () {
        describe('constructor', function () {
            it('should create a LRU cache with required capacity, expirationTime and cleanupTime', function () {
                var cache = new LRUCache(42, 1024, 256);
                expect(cache.capacity).to.be(42);
                expect(cache.cleanupTime).to.be(1024);
                return expect(cache.expirationTime).to.be(256);
            });
            return it('should create a LRU cache with default capacity, expirationTime and cleanupTime', function () {
                var cache = new LRUCache();
                expect(cache.capacity).to.be(256);
                expect(cache.cleanupTime).to.be(0);
                return expect(cache.expirationTime).to.be(0);
            });
        });

        describe('set()', function () {
            it('should add string key-value in cache', function () {
                var cache = new LRUCache();
                expect(cache.length).to.be(0);
                cache.set(data[0].key, data[0].value);
                expect(cache.length).to.be(1);
                expect(cache.keys).to.eql([data[0].key]);
                expect(cache.values).to.eql([data[0].value]);
                return expect(data[0].key).to.be(data[0].key);
            });

            it('should update value if a key is already in the cache', function () {
                var cache = new LRUCache();
                expect(cache.length).to.be(0);
                cache.set(data[0].key, data[0].value);
                expect(cache.length).to.be(1);
                cache.set(data[0].key, data[1].value);
                expect(cache.length).to.be(1);
                return expect(cache.get(data[0].key)).to.be(data[1].value);
            });

            it('should remove the least visited node if the cache reaches its capacity', function () {
                var cache = new LRUCache(2);
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                cache.set(data[2].key, data[2].value);
                expect(cache.keys).to.eql([data[1].key, data[2].key]);
                return expect(cache.values).to.eql([data[1].value, data[2].value]);
            });

            it('recently accessed via get() node should survive cleanup on reaching capacity', function () {
                var cache = new LRUCache(2);
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                cache.get(data[0].key);
                cache.set(data[2].key, data[2].value);
                expect(cache.keys).to.eql([data[0].key, data[2].key]);
                expect(cache.values).to.eql([data[0].value, data[2].value]);
                return expect(cache.has(data[1].key)).to.be(false);
            });

            return it('recently accessed via has() node should survive cleanup on reaching capacity', function () {
                var cache = new LRUCache(2);
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                expect(cache.has(data[0].key)).to.be(true);
                cache.set(data[2].key, data[2].value);
                expect(cache.keys).to.eql([data[0].key, data[2].key]);
                expect(cache.values).to.eql([data[0].value, data[2].value]);
                return expect(cache.has(data[1].key)).to.be(false);
            });
        });

        describe('get()', function () {
            var cache = new LRUCache();
            it('should return the cached value for a key exists in cache', function () {
                cache.set(data[0].key, data[0].value);
                return expect(cache.get(data[0].key)).to.be(data[0].value);
            });
            return it('should return undefined for key does not exist in cache', function () {
                return expect(cache.get('dummy')).to.be(undefined);
            });
        });

        describe('clear()', function () {
            var cache = new LRUCache();
            return it('clear should emptify cache', function () {
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                expect(cache.length).to.be(2);
                cache.clear();
                expect(cache.length).to.be(0);
                expect(cache.keys).to.be.eql([]);
                return expect(cache.values).to.be.eql([]);
            });
        });

        describe('remove()', function () {
            var cache = new LRUCache();
            it('should remove the key value from cache', function () {
                cache.set(data[0].key, data[0].value);
                expect(cache.length).to.be(1);
                cache.remove(data[0].key);
                return expect(cache.length).to.be(0);
            });
            return it('should do nothing if the key does not exist in the cache', function () {
                cache.set(data[0].key, data[0].value);
                expect(cache.length).to.be(1);
                cache.remove(data[1].key);
                return expect(cache.length).to.be(1);
            });
        });

        describe('keys', function () {
            return it('should return all keys in the cache', function () {
                var cache = new LRUCache();
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                return expect(cache.keys).to.eql([data[0].key, data[1].key]);
            });
        });

        describe('values', function () {
            it('should return all values in cache', function () {
                var cache = new LRUCache();
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                return expect(cache.values).to.eql([data[0].value, data[1].value]);
            });
            return it('should return empty array if all values expired', function (done) {
                var cache = new LRUCache(2, 200);
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                return setTimeout(function () {
                    expect(cache.values).to.eql([]);
                    return done();
                }, 300);
            });
        });

        describe('expirationTime (global)', function () {
            it('node should expire after expirationTime is over', function (done) {
                var cache = new LRUCache(2, 0, 200);
                cache.set(data[0].key, data[0].value);
                expect(cache.length).to.be(1);
                return setTimeout(function () {
                    expect(cache.get(data[0].key)).to.be(undefined);
                    expect(cache.length).to.be(0);
                    return done();
                }, 300);
            });

            it('set() should reset node expiration', function (done) {
                var cache = new LRUCache(2, 0, 300);
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                expect(cache.length).to.be(2);
                setTimeout(function () {
                    cache.set(data[0].key, data[0].value);
                }, 200);
                return setTimeout(function () {
                    expect(cache.get(data[0].key)).to.be(data[0].value);
                    expect(cache.get(data[1].key)).to.be(undefined);
                    expect(cache.length).to.be(1);
                    return done();
                }, 400);
            });

            return it('get() should reset node expiration', function (done) {
                var cache = new LRUCache(2, 0, 300);
                cache.set(data[0].key, data[0].value);
                setTimeout(function () {
                    cache.get(data[0].key);
                }, 200);
                return setTimeout(function () {
                    expect(cache.get(data[0].key)).to.be(data[0].value);
                    return done();
                }, 400);
            });
        });

        describe('cleanupTime', function () {
            it('cache should be cleared after cleanupTime is over', function (done) {
                var cache = new LRUCache(2, 200);
                cache.set(data[0].key, data[0].value);
                cache.set(data[1].key, data[1].value);
                expect(cache.length).to.be(2);
                return setTimeout(function () {
                    expect(cache.get(data[0].key)).to.be(undefined);
                    expect(cache.length).to.be(0);
                    return done();
                }, 300);
            });

            it('cache should not be cleared if any node was recently accessed', function (done) {
                var cache = new LRUCache(2, 300);
                cache.set(data[0].key, data[0].value);
                expect(cache.length).to.be(1);
                setTimeout(function () {
                    cache.has(data[0].key);
                }, 200);
                return setTimeout(function () {
                    expect(cache.length).to.be(1);
                    expect(cache.get(data[0].key)).to.be(data[0].value);
                    return done();
                }, 400);
            });
        });

        return describe('Multi instances check', function () {
            return it('multi instances should work', function () {
                var cache1 = new LRUCache();
                cache1.set(data[0].key, data[0].value);

                var cache2 = new LRUCache();
                cache2.set(data[0].key, data[0].value);
                cache2.set(data[1].key, data[1].value);
                cache2.set(data[2].key, data[2].value);

                expect(cache1.length).to.be(1);
                expect(cache1.keys).to.be.eql([data[0].key]);
                expect(cache1.values).to.be.eql([data[0].value]);

                expect(cache2.length).to.be(3);
                expect(cache2.keys).to.be.eql([data[0].key, data[1].key, data[2].key]);
                expect(cache2.values).to.be.eql([data[0].value, data[1].value, data[2].value]);

                cache2.remove(data[0].key);
                expect(cache2.length).to.be(2);
                expect(cache1.length).to.be(1);
                return expect(cache1.get(data[0].key)).to.be(data[0].value);
            });
        });
    });
})();

