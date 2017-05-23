process.env.TESTING = true;
var assert = require('assert');
var test = require('utest');
var osm = require('../lib/osm_processing');

// Setup default values
var defTableNames = ['members_nodes', 'members_relations', 'members_ways',
    'nodes', 'nodes_tags', 'relations', 'relations_tags', 'ways', 'ways_nodes',
    'ways_tags'];
var defTableFields = {
    members_nodes : ["node_id", "relation_id", "role"],
    members_relations : ["relation_id2", "relation_id", "role"],
    members_ways : ["way_id", "relation_id", "role"],
    nodes : ["id", "lat", "lon", "visible", "version", "changeset", "uid",
        "user", "timestamp"],
    nodes_tags : ["node_id", "k", "v"],
    relations : ["id", "visible", "version", "changeset", "uid", "user",
        "timestamp"],
    relations_tags : ["relation_id", "k", "v"],
    ways : ["id", "visible", "version", "changeset", "uid", "user",
        "timestamp"],
    ways_nodes : ["node_id", "way_id", "sequence"],
    ways_tags : ["way_id", "k", "v"]
};


/* Test the primitive variables in the module */
test(
    'var node_id:',
    {
        'var node_id is a string': function() {
            assert.strictEqual(typeof osm.node_id, 'string');
        },
        'var node_id is empty': function() {
            assert.strictEqual(osm.node_id, '');
        }
    }
);
test(
    'var relation_id',
    {
        'is a string': function() {
            assert.strictEqual(typeof osm.relation_id, 'string');
        },
        'is empty': function() {
            assert.strictEqual(osm.relation_id, '');
        }
    }
);

test(
    'var way_id',
    {
        'is a string': function() {
            assert.strictEqual(typeof osm.way_id, 'string');
        },
        'is empty': function() {
            assert.strictEqual(osm.way_id, '');
        }
    }
);

test(
    'var sequence:',
    {
        'is a number': function() {
            assert.strictEqual(typeof osm.sequence, 'number');
        },
        'is 0': function() {
            assert.strictEqual(osm.sequence, 0);
        }
    }
);

/* testing objects */
test(
    'var tableFields',
    {
        'is an object': function() {
            assert.strictEqual(typeof osm.tableFields, 'object');
        },
        'has the same amount of properties as there are tables':
        function () {
            assert.strictEqual(
                Object.keys(osm.tableFields).length, defTableNames.length);
        },
        'contains only proper tablenames as own Properties':
        function () {
            var i, key;
            for (i= 0; i < defTableNames.length; i += 1) {
                key = defTableNames[i];
                assert.strictEqual(osm.tableFields.hasOwnProperty(key), true);
            }
        },
        'has only array as properties': function() {
            var keys = Object.keys(osm.tableFields);
            var i;
            for (i = 0; i < keys.length; i += 1) {
                assert.strictEqual(Array.isArray(osm.tableFields[keys[i]]),
                    true);
            }
        }
    }
);

function mkTestsEachTableDefFields(elem, idx, arr) {
    test(
        'osm.tableFields.' + elem,
        {
            'has proper fieldnames and fieldname order': function () {
                assert.deepStrictEqual(
                    osm.tableFields[elem], defTableFields[elem]);
            }
        }
    );
}
defTableNames.forEach(mkTestsEachTableDefFields);

test(
    'var insAkku',
    {
        'is an object': function() {
            assert.strictEqual(typeof osm.insAkku, 'object');
        },
        'has the same amount of properties as there are tablenames':
        function () {
            assert.strictEqual(
                Object.keys(osm.insAkku).length, defTableNames.length);
        },
        'contains only proper tablenames as own Properties':
        function () {
            var i, key;
            for (i= 0; i < defTableNames.length; i += 1) {
                key = defTableNames[i];
                assert.strictEqual(osm.insAkku.hasOwnProperty(key), true);
            }
        },
        'has only arrays as properties': function() {
            var keys = Object.keys(osm.insAkku);
            var i;
            for (i = 0; i < keys.length; i += 1) {
                assert.strictEqual(Array.isArray(osm.insAkku[keys[i]]), true);
            }
        }
    }
);

test(
    'function sanitizeCommonValues()',
    {
        'converts all undefined attributes to null': function () {
            var attribs = {visible: undefined, version: undefined,
                changeset: undefined, uid: undefined, user: undefined,
                timestamp: undefined};
            assert.deepStrictEqual(
                osm.sanitizeCommonValues(attribs),
                {visible: null, version: null, changeset: null, uid: null,
                    user: null, timestamp: null});
        },
        'converts visible = "false" to 0': function () {
            var attribs = {visible: 'false', version: '4711',
                changeset: '4712', uid: '4713', user: 'Foo',
                timestamp: '2015-02-11T13:18:25Z'};
            assert.deepStrictEqual(
                osm.sanitizeCommonValues(attribs),
                {visible: 0, version: '4711', changeset: '4712', uid: '4713',
                    user: 'Foo', timestamp: '2015-02-11T13:18:25Z'});
        },
        'converts visible = "true" to 1': function () {
            var attribs = {visible: 'true', version: '4711',
                changeset: '4712', uid: '4713', user: 'Foo',
                timestamp: '2015-02-11T13:18:25Z'};
            assert.deepStrictEqual(
                osm.sanitizeCommonValues(attribs),
                {visible: 1, version: '4711', changeset: '4712', uid: '4713',
                    user: 'Foo', timestamp: '2015-02-11T13:18:25Z'});
        },
        'converts visible = [all but "true"|"false"-Strings] to null':
        function () {
            var attribs = {visible: 'foo', version: '4711',
                changeset: '4712', uid: '4713', user: 'Foo',
                timestamp: '2015-02-11T13:18:25Z'};
            assert.deepStrictEqual(
                osm.sanitizeCommonValues(attribs),
                {visible: null, version: '4711', changeset: '4712', uid: '4713',
                    user: 'Foo', timestamp: '2015-02-11T13:18:25Z'});
        }
    }
);

test(
    'function getNodeValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {visible: 'true', version: '4714',
                changeset: '4712', uid: '4713', user: 'Foo',
                timestamp: '2015-02-11T13:18:25Z', lat: '51.111', lon: '8.655'};
            assert.deepStrictEqual(
                osm.getNodeValuesArr(attribs),
                ["", '51.111', '8.655', 1, '4714', '4712', '4713', 'Foo',
                    '2015-02-11T13:18:25Z']);
        }
    }
);

test(
    'function getWayValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {visible: 'true', version: '4714',
                user: 'Foo', changeset: '4712', uid: '4713',
                timestamp: '2015-02-11T13:18:25Z'};
            assert.deepStrictEqual(
                osm.getWayValuesArr(attribs),
                ["", 1, '4714', '4712', '4713', 'Foo', '2015-02-11T13:18:25Z']);
        }
    }
);

test(
    'function getRelationValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {visible: 'true', version: '4714',
                user: 'Foo', changeset: '4712', uid: '4713',
                timestamp: '2015-02-11T13:18:25Z'};
            assert.deepStrictEqual(
                osm.getRelationValuesArr(attribs),
                ["", 1, '4714', '4712', '4713', 'Foo', '2015-02-11T13:18:25Z']);
        }
    }
);

test(
    'function getNodes_tagsValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {v: "value", k: "key"};
            assert.deepStrictEqual(
                osm.getNodes_tagsValuesArr(attribs),
                ["", "key", "value"]);
        }
    }
);

test(
    'getWays_tagsValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {v: "value", k: "key"};
            assert.deepStrictEqual(
                osm.getWays_tagsValuesArr(attribs),
                ["", "key", "value"]);
        }
    }
);

test(
    'getWays_nodesValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {ref: "4711"};
            assert.deepStrictEqual(
                osm.getWays_nodesValuesArr(attribs),
                ["4711", "", 1]);
        }
    }
);

test(
    'getRelations_tagsValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {v: "value", k: "key"};
            assert.deepStrictEqual(
                osm.getRelations_tagsValuesArr(attribs),
                ["", "key", "value"]);
        }
    }
);

test(
    'getMembers_xValuesArr',
    {
        'returns attributes in an index array in the right order': function () {
            var attribs = {role: "Testrole", ref: "0815"};
            assert.deepStrictEqual(
                osm.getMembers_xValuesArr(attribs),
                ["0815", "", "Testrole"]);
        }
    }
);
