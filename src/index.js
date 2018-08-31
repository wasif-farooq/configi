const { join } = require('path');
const { parse } require('./parser');

class Config
{
    constructor() {
        this.configs = {};
        this.init();
    }

    get(path) {

        if (!path || path === "") {
            return this.configs;
        }

        let  parts = path.split('.');
        let value = this.configs;
        do {

            let property = parts.shift();
            if (typeof value[property] === 'undefined') {
                throw new Error('the config path ${path} you trying to get is not exists');
            }

            value = value[property];

        } while (parts.length > 0);
        return value;
    }

    init() {

        NODE_ENV = NODE_ENV || 'development';

        let CONFIG_DIR = configDir ||  join( process.cwd(), '.config');
        if (CONFIG_DIR.indexOf('.') === 0) {
            CONFIG_DIR = join(process.cwd() , CONFIG_DIR);
        }

        const file = join(CONFIG_DIR, NODE_ENV + '.json');
        this.configs = parse(file);
    }
}