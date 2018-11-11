const EventEmitter = require('events');
const read = require('.//properties-parser');
const flat = require('.//flat');
const path = require('path');
const fs = require('fs');

/**
 * This class is used to generate the file. it grabs properties file 
 * and template file and generate config json file according to node env
 */
class  Generator extends EventEmitter
{
    /**
     * 
     * @param String properties The path of .properties file
     * @param String template The path of config template file
     * @param String output The path of file that gona generate by code
     * @return void
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
     * @return void
     */
    init()
    {
        this.once('load', this.load.bind(this));
        this.on('read', this.read.bind(this));
        this.on('start', this.start.bind(this));
        this.on('transform', this.transform.bind(this));
        this.on('error', this.error.bind(this));
    }

    /**
     * return void
     */
    load(err, data)
    {
        read(this.properties, this.onLoad.bind(this));
    }

    /**
     * 
     * @param String err The error message if there any error in loading the properties file otherwise null
     * @param Object data The parsed content of .properties file.
     * @return void
     */
    onLoad(err, data)
    {
        if (err) {
            this.emit('error', err);
        }

        this.fields = data;
        this.emit('start');
    }

    /**
     * @return void
     */
    start()
    {
        if (!fs.existsSync(this.template)) {
            this.emit('error', 'The template file not exists or not readable');
        }

        if (!fs.existsSync(this.output)) {

            fs.writeFile(this.output, '', (err) => {
                if (err) {
                    this.emit('error', 'There is error creating file. please check directory permission');
                }
                this.emit('read');
            });

        } else {

            fs.access(this.output, fs.constants.W_OK, (err) => {
                if(err){
                    this.emit('error', 'Write Permission denied on destination file');
                    return;
                }

                this.emit('read');
            });

        }
    }

    /**
     * @return void
     */
    read()
    {
        this.writeable = fs.createWriteStream(this.output, 'utf-8');
        this.readable = fs.createReadStream(this.template, 'utf-8');

        this.readable.on('data', this.onRead.bind(this));
        this.readable.on('close', this.finish.bind(this));
    }

    /**
     * 
     * @param String chunk The chunk of a template file to read.
     * @return void
     */
    onRead(chunk)
    {
        this.emit('transform', chunk);
    }

    /**
     * 
     * @param String data The chunk of template data to transform the merge fields
     * @return void
     */
    transform(data)
    {
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
     * @param String data The error message if there any error
     * @return void
     */
    error(data) {
        console.log('Error : ' + data);
        process.exit(0);
    }

    /**
     * @return void
     */
    finish()
    {
        this.emit('finish');
    }
}

module.exports = { Generator };