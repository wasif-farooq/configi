const EventEmitter = require('events');
const { createInterface } = require('readline');
const fs = require('fs');

class Reader extends EventEmitter
{
    constructor(path, callback)
    {
        super();
        this.path = path;
        this.callback = callback;
        this.reader = {};
        this.properties = {};
        this.setup();
    }

    setup()
    {
        this.on('start', this.start.bind(this));
        this.on('line', this.parse.bind(this));
        this.on('error', this.error.bind(this));
        this.on('finish', this.finish.bind(this));
        this.emit('start');
    }

    start()
    {
        if (!fs.existsSync(this.path)) {
            this.emit('error', 'The proerpties file not exists or not readable');
            return;
        }

        this.reader = createInterface({
            input: require('fs').createReadStream(this.path)
        });

        this.reader.on('line', (line) => this.emit('line', line));
        this.reader.on('close', (line) => this.emit('finish', line));
    }

    parse(line)
    {
        let regex = new RegExp('(^[a-zA-Z0-9][a-zA-Z0-9._]*?)\=(.*)');
        let matches = line.match(regex);

        if (matches) {
            this.properties[matches[1]] = matches[2];
        }
    }

    finish() {
        if (this.callback) {
            this.callback(null, Object.assign({}, this.properties));
        }
    }

    error(message) {
        if (this.callback) {
            this.callback(message, null);
        }
    }

    static init(path, callback)
    {
        return new Reader(path, callback);
    }
}

module.exports = Reader.init;