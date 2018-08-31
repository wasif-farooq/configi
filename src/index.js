const { join } = require('path');
const { parse } require('./parser');

class Config
{
    constructor() {
        this.configs = {};
        this.init();
    }

    get(path) {

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