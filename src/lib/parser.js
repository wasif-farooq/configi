const fs = require('fs');
const flat = require('./flat');

/**
 * This class is used to parse the config json file it validates either 
 * file is valid json or not
 */
class Parser
{
    /**
     * 
     * @param String file The path of generate config file.
     * @return void
     */
    constructor(file)
    {
        this.parse(file);
    }

    /**
     * 
     * @param String file The path of generate config file.
     * @return String
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
     * @param String file The path of generate config file.
     * @return void
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

    /**
     * @return function
     */
    static init()
    {
        return new Parser().parse;
    }
}

module.exports.parse = Parser.init;