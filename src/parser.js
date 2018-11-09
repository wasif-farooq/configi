const fs = require('fs');
const flat = require('./cli/lib/flat');

/**
 * 
 */
class Parser
{
    /**
     * 
     * @param {*} file 
     */
    constructor(file) {
        this.parse(file);
    }

    /**
     * 
     * @param {*} file 
     */
    read(file) {

        try {
            let stat = fs.statSync(file);
            if (!stat || stat < 1) {
                return null;
            } 
        } catch (e) {
            return null;
        }

        try {
            let content = fs.readFileSync(file);
            content = content.replace(/^\uFEFF/, '');
        } catch (e) {
            throw new Error('Config file ' + file + ' cannot be read');
        }

        return flat(content);

    }

    /**
     * 
     * @param {*} file 
     */
    parse(file) {
        let content = this.read(file);

        try {
            let obj = JSON.parse(content);
        } catch (e) {
            throw e;
        }
    }
}

let parser = new Parser();
module.exports.parse = parser.parse;

/**
 * var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./te.txt')
  });
  
  lineReader.on('line', function (line) {
    //console.log('Line from file:', line);
    const regex = new RegExp('(^[a-zA-Z0-9][a-zA-Z0-9._]*?)\=(.*)');
    
    console.log(line.match(regex));
  });*/
 */