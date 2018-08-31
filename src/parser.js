const fs = require('fs');

class Parser
{
    constructor(file) {
        this.parse(file);
    }

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

        return content;

    }

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