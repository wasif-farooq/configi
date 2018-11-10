const { join } = require('path');
const { parse } require('./lib/parser');

class Configy
{
    constructor()
    {
        this.configs = {};
        this.init();
    }

    get(path = '')
    {

        if (!path || path === '') {
            return this.configs;
        }

        if (this.configs[path]) {
            return this.configs[path];
        }
    }

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
module.exports = new Config();