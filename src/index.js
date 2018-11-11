const { join } = require('path');
const { parse } require('./lib/parser');

/**
 * This is main class that handles the generated config
 * It enable you to grab the properties value from generated json file.
 */
class Configi
{
    /**
     * @return void
     */
    constructor()
    {
        this.configs = {};
        this.init();
    }

    /**
     * 
     * @param {String} path The path of a config which value you wanted to get.
     * @return Array|String|Object
     */
    get(path = '')
    {

        if (!path || path === '') {
            return this.configs;
        }

        if (this.configs[path]) {
            return this.configs[path];
        }
    }

    /**
     * @return void
     */
    init()
    {
        let env = process.env.NODE_ENV || 'dev';

        let CONFIG_DIR = configDir ||  join( process.cwd(), 'config');
        if (CONFIG_DIR.indexOf('.') === 0) {
            CONFIG_DIR = join(process.cwd() , CONFIG_DIR);
        }

        const file = join(CONFIG_DIR, 'config.' + env + '.json');
        this.configs = parse(file);
    }
}
module.exports = new Configi();