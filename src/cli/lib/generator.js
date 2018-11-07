const EventEmitter = require('events');
const read = require('.//read');
const flat = require('.//flat');
const path = require('path');
const fs = require('fs');

class  Generator extends EventEmitter
{
    constructor(source, destination)
    {
        super();
        this.source = source;
        this.destination = destination;

        this.readable = {};
        this.writeable = {};

        this.fields = {};
        this.options = {
            path: true,
            namespaces: true,
            comment: [';', '#']
        };

        this.init();
        this.emit('load');
    }

    init() {
        this.once('load', this.load.bind(this));
        this.on('read', this.read.bind(this));
        this.on('transform', this.transform.bind(this));
    }

    load() {
        read(this.source, this.options, this.onLoad.bind(this));
    }

    onLoad(err, data) {
        if (err) {
            console.error(err);
        }

        this.fields = flat(data);
        this.emit('read');
    }

    read() {
        let dirname = path.dirname(this.source);
        let source = path.join(dirname, 'config', 'config.template.json');
        this.writeable = fs.createWriteStream(this.destination, 'utf-8');
        this.readable = fs.createReadStream(source, 'utf-8');

        this.readable.on('data', this.onRead.bind(this));
        this.readable.on('close', this.finish.bind(this));
    }

    onRead(chunk) {
        this.emit('transform', chunk);
    }

    transform(data) {
        let regex  = /{{([a-zA-Z_.]*\.[a-zA-Z_]*)}}/gi;
        let matches = [...new Set(data.match(regex))]; 

        for (let i in matches) {
            let key = matches[i].replace('{{', '').replace('}}', '');
            let value = this.fields[key] || '';
            data = data.replace(new RegExp(matches[i], 'g'), value);
        }
        
        this.writeable.write(data);
    }

    finish() {
        this.emit('finish');
    }
}

module.exports = { Generator };