var inputFilename = process.argv[2];
// added BOM (byte order mark) required to process the output on windows. :-/
console.log("\ufeffSET NAMES 'UTF8';");
console.log("SET FOREIGN_KEY_CHECKS = 0;\nSET UNIQUE_CHECKS = 0;");
console.log(
    '/* input-file: ' + inputFilename + ' */'
);
/*
 * dependencies
 */
var htmlparser2 = require("htmlparser2");
var readline = require('readline');
var fs = require('fs');
var osm = require('./lib/osm_processing.js');

fs.accessSync(inputFilename, fs.constants.R_OK);

// process tags including inner tags and echo to console
var parser = new htmlparser2.Parser(
    {
        onopentag: osm.htmlparser2OnOpentag,
        onclosetag: osm.htmlparser2OnClosetag,
        onerror: osm.htmlparser2OnError
    },
    {
        decodeEntities: true,
        xmlMode: true
    }
);

var rl = readline.createInterface({
    input: fs.createReadStream(inputFilename)
});
rl.on('line', function (line) {
    parser.write(line);
});
rl.input.on("end", osm.readlineOnEnd);
