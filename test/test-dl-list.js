(function () {
    'use strict';

    //jshint mocha:true

    var expect = require('expect.js');
    var DLL = require('../src/dl-list');

    var data = ['value1', 42, 'value2', 256, 'value3'];

    function _createList(size) {
        var list = new DLL();
        var nodes = [];
        for (var i = 0; i < size; ++i) {
            nodes.push(list.append(data[i % data.length]));
        }
        return {
            list: list,
            nodes: nodes
        };
    }

    describe('js-dl-list', function () {
        describe('single element list', function () {
            var list = _createList(1).list;

            it('check length', function () {
                return expect(list.length).to.be(1);
            });

            it('check tail', function () {
                expect(list.tail.data).to.be(data[0]);
                expect(list.tail.prev).to.be(undefined);
                return expect(list.tail.next).to.be(undefined);
            });

            it('check head', function () {
                expect(list.head.data).to.be(data[0]);
                expect(list.head.prev).to.be(undefined);
                return expect(list.head.next).to.be(undefined);
            });

            it('check head equals to tail', function () {
                return expect(list.head).to.be(list.tail);
            });

            it('check remove', function () {
                var listNode = list.removeFromTail();
                expect(list.head).to.be(undefined);
                expect(list.tail).to.be(undefined);
                expect(listNode.prev).to.be(undefined);
                expect(listNode.next).to.be(undefined);
                expect(list.length).to.be(0);
                expect(list.removeFromTail()).to.be(undefined);
                return expect(list.removeFromHead()).to.be(undefined);
            });
        });

        describe('append check', function () {
            var list = new DLL();
            var listNodes = [];

            return it('length should be increased on each append', function () {
                listNodes.push(list.append(data[0]));
                expect(list.length).to.be(1);
                listNodes.push(list.append(data[1]));
                expect(list.length).to.be(2);
                listNodes.push(list.append(data[2]));
                return expect(list.length).to.be(3);
            });
        });

        describe('check pointers and data after append', function () {
            var createRes = _createList(3);
            var listNodes = createRes.nodes;

            it('pointer check tail', function () {
                expect(listNodes[0].data).to.be(data[0]);
                expect(listNodes[0].prev).to.be(undefined);
                return expect(listNodes[0].next.data).to.be(data[1]);
            });

            it('pointer check head', function () {
                expect(listNodes[2].data).to.be(data[2]);
                expect(listNodes[2].prev.data).to.be(data[1]);
                return expect(listNodes[2].next).to.be(undefined);
            });

            return it('pointer check middle', function () {
                expect(listNodes[1].data).to.be(data[1]);
                expect(listNodes[1].prev.data).to.be(data[0]);
                return expect(listNodes[1].next.data).to.be(data[2]);
            });
        });

        describe('check data and length on append', function () {
            return it('pointer check middle', function () {
                var list = new DLL();
                for (var i = 0; i < 100; ++i) {
                    var value = data[i % data.length];
                    var node = list.append(value);
                    expect(list.length).to.be(i + 1);
                    expect(node.data).to.be(value);
                    expect(node).to.be(list.head);
                }
                expect(list.length).to.be(100);
            });
        });

        describe('head and tail getters check', function () {
            var list = _createList(2).list;

            it('check tail getter', function () {
                expect(list.tail.data).to.be(data[0]);
                expect(list.tail.prev).to.be(undefined);
                return expect(list.tail.next.data).to.be(data[1]);
            });

            return it('check head getter', function () {
                expect(list.head.data).to.be(data[1]);
                expect(list.head.prev.data).to.be(data[0]);
                return expect(list.head.next).to.be(undefined);
            });
        });

        describe('removed items pointers check', function () {
            it('remove from tail check', function () {
                var list = _createList(3).list;
                var node = list.removeFromTail();

                expect(node.prev).to.be(undefined);
                expect(node.next).to.be(undefined);
                return expect(list.length).to.be(2);
            });

            it('remove from head check', function () {
                var list = _createList(3).list;
                var node = list.removeFromHead();

                expect(node.prev).to.be(undefined);
                expect(node.next).to.be(undefined);
                return expect(list.length).to.be(2);
            });

            return it('remove from middle check', function () {
                var listRes = _createList(3);
                var list = listRes.list;
                var node = listRes.nodes[1];

                node = list.remove(node);
                expect(node.prev).to.be(undefined);
                expect(node.next).to.be(undefined);
                return expect(list.length).to.be(2);
            });
        });

        describe('iteration by removing check', function () {
            it('direct', function () {
                var listRes = _createList(100);
                var list = listRes.list;
                var nodes = listRes.nodes.map(function (obj) {
                    return obj.data;
                });

                var removedNodes = [];
                for (var i = 0; i < 100; ++i) {
                    var node = list.removeFromTail();
                    removedNodes.push(node);
                    expect(node.prev).to.be(undefined);
                    expect(node.next).to.be(undefined);
                }

                expect(list.removeFromTail()).to.be.eql(undefined);
                expect(list.removeFromHead()).to.be.eql(undefined);
                return expect(nodes).to.be.eql(removedNodes);
            });

            it('reverse', function () {
                var listRes = _createList(100);
                var list = listRes.list;
                var nodes = listRes.nodes.map(function (obj) {
                    return obj.data;
                });

                var removedNodes = [];
                for (var i = 0; i < 100; ++i) {
                    var node = list.removeFromHead();
                    removedNodes.splice(0, 0, node);
                    expect(node.prev).to.be(undefined);
                    expect(node.next).to.be(undefined);
                }

                expect(list.removeFromTail()).to.be.eql(undefined);
                expect(list.removeFromHead()).to.be.eql(undefined);
                return expect(nodes).to.be.eql(removedNodes);
            });
        });
    });
})();