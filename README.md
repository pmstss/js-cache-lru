# js-cache-lru

JS lru-cache library available both as [npm](https://www.npmjs.com/package/js-cache-lru) and [Bower](http://bower.io/) package. AMD/CommonJS/browser compliant.
Supports capacity and entry max edge as constructor parameters.

Each set or get operation will reset last visited time of cached entry. When reaching capacity, [least recently used](https://en.wikipedia.org/wiki/Cache_algorithms#LRU) entry will be removed.

Internally uses double linked list and hash for entries lookup to provide constant time ([O(1) complexity](https://en.wikipedia.org/wiki/Big_O_notation)) for entries get, set and remove.
Note: entries hash is implemented as plain js object, so all keys will be treated as strings.

## Installation
* via npm
    `npm install js-cache-lru --save`
* via bower
    `bower install js-cache-lru --save`

## APIs
* constructor
    - has optional capacity (defaults to 256) and maxAge (in milliseconds; defaults to 0 - i.e. entries will be never cleared)
    ```javascript
    var LRUCache = require('lru-cache');
    var cache = new LRUCache([capacity], [maxAge]);
    ```

* set(key, value) _O(1)_
    - if key doesn't exist, adds key/value entry to cache
    - if key exists, updates value and entry last visited time
    - if cache reaches its capacity, least recently used entry will be removed
    ```javascript
    cache.set('key1', 'value1');
    ```

* get(key) _O(1)_
    - if key exists, returns value and updates entry last visited time 
    - if key exists but is expired, returns undefined (removing key/value internally)
    - if key does not exist, returns undefined
    ```javascript
    cache.get('key1'); // should return 'value1'
    ```

* clear() _O(n)_
    - removes all entries from cache. Internally clears hash and double linked list with nilling prev/next entries references.
    ```javascript
    cache.clear(); // now cache.size is 0
    ```

* remove(key) _O(1)_
    - removes key from cache
    ```javascript
    cache.remove('key1');
    cache.get('key1'); // returns undefined
    ```

* size _O(1)_
    ```javascript
    cache.size; // getter for cache actual size
    ```

* keys _O(n)_
    ```javascript
    cache.keys; // getter for all cache keys
    ```

* values _O(n)_
    ```javascript
    cache.values; // getter for all cache values
    ```

* capacity _O(1)_
    ```javascript
    cache.capacity; // getter for capacity (either specified in constructor or default)
    ```

* maxAge _O(1)_
    ```javascript
    cache.maxAge; // getter for maxAge (either specified in constructor or default)
    ```

## Development

```sh
    git clone https://github.com/pmstss/js-cache-lru # clone this repository
    cd js-cache-lru
    npm install # installs node modules (assuming that npm and node are already installed)
    # <do changes>
    npm run test # run tests
    # submit pull request https://github.com/pmstss/js-cache-lru/pulls
```

## Credits
Inspired by and based on https://github.com/viruschidai/lru-cache 

## License
The MIT License (MIT)