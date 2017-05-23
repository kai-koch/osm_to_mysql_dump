var SqlString = require('sqlstring');
module.exports = {};
var node_id = "";
var way_id = "";
var relation_id = "";
var sequence = 0;

var tableFields = {
    members_nodes : ["node_id", "relation_id", "role"],
    members_relations : ["relation_id2", "relation_id", "role"],
    members_ways : ["way_id", "relation_id", "role"],
    nodes : [
        "id", "lat", "lon", "visible", "version", "changeset", "uid", "user",
        "timestamp"],
    nodes_tags : ["node_id", "k", "v"],
    relations : ["id", "visible", "version", "changeset", "uid", "user", "timestamp"],
    relations_tags : ["relation_id", "k", "v"],
    ways : [
        "id", "visible", "version", "changeset", "uid", "user", "timestamp"],
    ways_nodes : ["node_id", "way_id", "sequence"],
    ways_tags : ["way_id", "k", "v"]
};

var insAkku = {
    members_nodes : [],
    members_relations : [],
    members_ways : [],
    nodes : [],
    nodes_tags : [],
    relations : [],
    relations_tags : [],
    ways : [],
    ways_nodes : [],
    ways_tags : []
};

if (process.env.TESTING) {
    module.exports.node_id = node_id;
    module.exports.way_id = way_id;
    module.exports.relation_id = relation_id;
    module.exports.sequence = sequence;
    module.exports.tableFields = tableFields;
    module.exports.insAkku = insAkku;
}

/**
 * Lookup table akkumulator and write content as escaped
 * "INSERT INTO ..."-String to console.
 * Resets the coresponding akku.
 *
 * @param {String} table Name of the table to lookup
 * @returns {undefined}
 */
function writeAkku(table) {
    var sql = 'INSERT INTO ?? (??) VALUES ';
    console.log(
        SqlString.format(sql, [table, tableFields[table]]) +
        insAkku[table].join(",") + ";");
    insAkku[table] = [];
}

/**
 * Add escaped String-Element from values-array to the akkunulator of table
 * calls writeAkku if 99+ elements present
 * @param {String} table Name of table
 * @param {Array} values Values to stored in table
 * @returns {undefined}
 */
function mkInsertRow (table, values) {
    insAkku[table].push("(" + SqlString.escape(values) + ")");
    if (insAkku[table].length > 99) {
        writeAkku(table);
    }
}

/**
 * Checks the common standard attributes of "nodes", "relations" and "ways" for
 * undefined or empty values and transform Booleans to 0 or 1
 * @param {Object} att Object-Literal with attributes
 * @returns {Object}
 */
function sanitizeCommonValues(att) {
    if (typeof att.visible === 'undefined') {
        att.visible = null;
    } else if (att.visible === 'true') {
        att.visible = 1;
    } else if (att.visible === 'false') {
        att.visible = 0;
    } else {
        att.visible = null;
    }
    if (typeof att.version === 'undefined') {
        att.version = null;
    }
    if (typeof att.changeset === 'undefined') {
        att.changeset = null;
    }
    if (typeof att.uid === 'undefined') {
        att.uid = null;
    }
    if (typeof att.user === 'undefined') {
        att.user = null;
    }
    if (typeof att.timestamp === 'undefined') {
        att.timestamp = null;
    }
    return att;
}
if (process.env.TESTING) {
    module.exports.sanitizeCommonValues = sanitizeCommonValues;
}

/**
 * Returns an Array with the values for the 'nodes'-table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with node attributes
 * @returns {Array}
 */
function getNodeValuesArr(att) {
    att = sanitizeCommonValues(att);
    return [node_id, att.lat, att.lon, att.visible, att.version, att.changeset,
        att.uid, att.user, att.timestamp];
}
if (process.env.TESTING) {
    module.exports.getNodeValuesArr = getNodeValuesArr;
}

/**
 * Returns an Array with the values for the 'ways'-table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with way attributes
 * @returns {Array}
 */
function getWayValuesArr(att) {
    att = sanitizeCommonValues(att);
    return [way_id, att.visible, att.version, att.changeset, att.uid, att.user,
        att.timestamp];
}
if (process.env.TESTING) {
    module.exports.getWayValuesArr = getWayValuesArr;
}

/**
 * Returns an Array with the values for the 'relations'-table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with relation attributes
 * @returns {Array}
 */
function getRelationValuesArr(att) {
    att = sanitizeCommonValues(att);
    return [relation_id, att.visible, att.version, att.changeset, att.uid, att.user,
        att.timestamp];
}
if (process.env.TESTING) {
    module.exports.getRelationValuesArr = getRelationValuesArr;
}

/**
 * Returns an Array with the values for the 'nodes_tags'-table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with attributes
 * @returns {Array}
 */
function getNodes_tagsValuesArr(att) {
    return [node_id, att.k, att.v];
}
if (process.env.TESTING) {
    module.exports.getNodes_tagsValuesArr = getNodes_tagsValuesArr;
}
/**
 * Returns an Array with the values for the 'ways_tags'-table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with attributes
 * @returns {Array}
 */
function getWays_tagsValuesArr(att) {
    return [way_id, att.k, att.v];
}
if (process.env.TESTING) {
    module.exports.getWays_tagsValuesArr = getWays_tagsValuesArr;
}

/**
 * Returns an Array with the values for the 'ways_nodes'-table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with attributes
 * @returns {Array}
 */
function getWays_nodesValuesArr(att) {
    sequence += 1;
    return [att.ref, way_id, sequence];
}
if (process.env.TESTING) {
    module.exports.getWays_nodesValuesArr = getWays_nodesValuesArr;
}

/**
 * Returns an Array with the values for the 'relations_tags'-table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with attributes
 * @returns {Array}
 */
function getRelations_tagsValuesArr(att) {
    return [relation_id, att.k, att.v];
}
if (process.env.TESTING) {
    module.exports.getRelations_tagsValuesArr = getRelations_tagsValuesArr;
}

/**
 * Returns an Array with the values for the 'members_nodes', 'members_relations'
 * or 'members_tags' table to be used in
 * "INSERT INTO ... VALUES ([VALUES]), [...]"-query
 * @param {Object} att Object-Literal with member attributes
 * @returns {Array}
 */
function getMembers_xValuesArr(att) {
    return [att.ref, relation_id, att.role];
}
if (process.env.TESTING) {
    module.exports.getMembers_xValuesArr = getMembers_xValuesArr;
}

/**
 * Resolves the member type and makes the according insert row
 * @param {Objects} att Object-Literal with member attributes
 * @returns {undefined}
 */
function procMemberType(att) {
    switch (att.type) {
    case "way":
        mkInsertRow("members_ways", getMembers_xValuesArr(att));
        break;
    case "node":
        mkInsertRow("members_nodes", getMembers_xValuesArr(att));
        break;
    case "relation":
        mkInsertRow("members_relations", getMembers_xValuesArr(att));
        break;
    default:
        console.log("/* unknown member type: " + JSON.stringify(att) + " */");
    }
}

/**
 * XML-tag "tag" found. determine where the tag belongs to and make Insert-Row
 * for the coresponding table
 * @param {type} att
 * @returns {undefined}
 */
function procTags(att) {
    if (node_id !== "") {
        mkInsertRow("nodes_tags", getNodes_tagsValuesArr(att));
    }
    if (way_id !== "") {
        mkInsertRow("ways_tags", getWays_tagsValuesArr(att));
    }
    if (relation_id !== "") {
        mkInsertRow("relations_tags", getRelations_tagsValuesArr(att));
    }
}

/**
 * Callback-Function to hook into readline.onEnd-Event
 * Make the last remaining "INSERT INTO ..."-queries from the akkus, when the
 * OSM-Files is read completly
 * @returns {undefined}
 */
function readlineOnEnd() {
    var prop;
    for (prop in insAkku) {
        if (insAkku.hasOwnProperty(prop) && insAkku[prop].length > 0) {
            writeAkku(prop);
        }
    }
    console.log("SET UNIQUE_CHECKS = 1;\nSET FOREIGN_KEY_CHECKS = 1;");
}
module.exports.readlineOnEnd = readlineOnEnd;

/**
 * Callback-Function to hook into htmlparser2.onError-Event
 * Log the error as multiline SQL-Comment
 * @param {Error} error
 * @returns {undefined}
 */
function htmlparser2OnError(error) {
    console.log("/* xml-error: " + JSON.stringify(error) + " */");
}
module.exports.htmlparser2OnError = htmlparser2OnError;

/**
 * Callback-Function to hook into htmlparser2.onOpentag-Event
 * Processes the found tag. Unknown tags are logged as multiline SQL-comment.
 * @param {String} tagname Name of the tag found
 * @param {Object} att Object literal with the attributes of the tag
 * @returns {undefined}
 */
function htmlparser2OnOpenTag(tagname, att) {
    switch(tagname) {
    case "node":
        node_id = att.id;
        mkInsertRow("nodes", getNodeValuesArr(att));
        break;
    case "way":
        way_id = att.id;
        mkInsertRow("ways", getWayValuesArr(att));
        break;
    case "relation":
        relation_id = att.id;
        mkInsertRow("relations", getRelationValuesArr(att));
        break;
    case "nd":
        if (way_id !== "") {
            mkInsertRow("ways_nodes", getWays_nodesValuesArr(att));
        }
        break;
    case "tag":
        procTags(att);
        break;
    case "member":
        if (relation_id !== "") {
            procMemberType(att);
        }
        break;
    case "osm":
        console.log("/* osm: " + JSON.stringify(att) + " */");
        break;
    case "bounds":
        console.log("/* bounds: " + JSON.stringify(att) + " */");
        break;
    default:
        console.log("/* unknown xml-tag!\n" +
            tagname + ": " + JSON.stringify(att) + " */");
    }
}
module.exports.htmlparser2OnOpentag = htmlparser2OnOpenTag;

/**
 * Callback-Function to hook into htmlparser2.onClosetag-Event
 * Checks, if there is some cleanup to do for a known closing tag.
 * Unknown tags are logged as multiline SQL-comment
 * @param {String} tagname
 * @returns {undefined}
 */
function htmlparser2OnClosetag(tagname) {
    switch(tagname) {
    case "node":
        node_id = "";
        break;
    case "way":
        way_id = "";
        sequence = 0;
        break;
    case "relation":
        relation_id = "";
        break;
    case "nd":
        break;
    case "tag":
        break;
    case "member":
        break;
    case "osm":
        break;
    case "bounds":
        break;
    default:
        console.log("/* unknown xml-tag '" + tagname + "' closed */");
    }
}
module.exports.htmlparser2OnClosetag = htmlparser2OnClosetag;
