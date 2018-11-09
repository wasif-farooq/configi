const EventEmitter = require('events');
const read = require('.//read');
const flat = require('.//flat');
const path = require('path');
const fs = require('fs');

/**
 * 
 */
class  Generator extends EventEmitter
{
    /**
     * 
     * @param {*} properties 
     * @param {*} template 
     * @param {*} output 
     */
    constructor(properties, template, output)
    {
        super();
        this.properties = properties;
        this.template = template;
        this.output = output;

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

    /**
     * 
     */
    init() {
        this.once('load', this.load.bind(this));
        this.on('read', this.read.bind(this));
        this.on('start', this.start.bind(this));
        this.on('transform', this.transform.bind(this));
    }

    /**
     * 
     */
    load() {
        read(this.properties, this.options, this.onLoad.bind(this));
    }

    /**
     * 
     * @param {*} err 
     * @param {*} data 
     */
    onLoad(err, data) {
        if (err) {
            console.error(err);
        }

        this.fields = flat(data);
        this.emit('read');
    }

    /**
     * 
     */
    read() {

        if (!fs.existsSync(this.template)) {
            this.emit('error', 'The template file not exists or not readable');
        }

        if (!fs.existsSync(this.output)) {

            fs.writeFile(this.output, '', (err) => {
                if (err) {
                    this.emit('error', 'There is error creating file. please check directory permission');
                }
                this.emit('start');
            });

        } else {

            fs.access(this.output, fs.constants.W_OK, (err) => {
                if(err){
                    this.emit('error', 'Write Permission denied on destination file');
                    return;
                }

                this.emit('start');
            });

        }
    }

    /**
     * 
     */
    start() {
        this.writeable = fs.createWriteStream(this.output, 'utf-8');
        this.readable = fs.createReadStream(this.template, 'utf-8');

        this.readable.on('data', this.onRead.bind(this));
        this.readable.on('close', this.finish.bind(this));
    }

    /**
     * 
     * @param {*} chunk 
     */
    onRead(chunk) {
        this.emit('transform', chunk);
    }

    /**
     * 
     * @param {*} data 
     */
    transform(data) {
        let regex = new RegExp('{{(.*?)}}', 'g');
        let matches = [...new Set(data.match(regex))]; 

        for (let i in matches) {
            let key = matches[i].replace('{{', '').replace('}}', '');
            let value = this.fields[key] || '';
            data = data.replace(new RegExp(matches[i], 'g'), value);
        }
        
        this.writeable.write(data);
    }

    /**
     * 
     */
    finish() {
        this.emit('finish');
    }
}

module.exports = { Generator };