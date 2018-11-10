const fs = require('fs');
const flat = require('./flat');

/**
 * 
 */
class Parser
{
    /**
     * 
     * @param {*} file 
     */
    constructor(file)
    {
        this.parse(file);
    }

    /**
     * 
     * @param {*} file 
     */
    read(file)
    {

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

    /**
     * 
     * @param {*} file 
     */
    parse(file)
    {
        let content = flat(this.read(file));

        try {
            let obj = JSON.parse(content);
        } catch (e) {
            throw e;
        }
    }

    static init()
    {
        return new Parser().parse;
    }
}

module.exports.parse = Parser.init;