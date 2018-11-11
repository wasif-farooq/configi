const EventEmitter = require('events');
const { createInterface } = require('readline');
const fs = require('fs');

/***
 * This class handles properties file it load and read the file.
 * it generate key value pair of your .properties file to use in Generator class
 */
class Reader extends EventEmitter
{
    /**
     * 
     * @param String path The path of .properties file
     * @param Function callback The callback function that will be called when finished or got a error
     * @return void
     */
    constructor(path, callback)
    {
        super();
        // the path of .properties file.
        this.path = path;

        // The callback function that will be called when finished or got a error
        this.callback = callback;

        // the reader object to read the file.
        this.reader = {};

        // This is used to store outputed properties in key value pair
        this.properties = {};

        // this setup the event handlers
        this.setup();
    }

    /**
     * @return void
     */
    setup()
    {
        // this will trigger when it start the procesing
        this.on('start', this.start.bind(this));

        // the will trigger when it read a complete line and send data to its listeners
        this.on('line', this.parse.bind(this));

        // this will trigger when got any error.
        this.on('error', this.error.bind(this));

        // this will trigger when all execution is completed.
        this.on('finish', this.finish.bind(this));

        // triggering the start event.
        this.emit('start');
    }

    /**
     * @return void
     */
    start()
    {
        // checking the file is exists of not if not then trigger an error event that will call the callback with error message
        if (!fs.existsSync(this.path)) {
            this.emit('error', 'The proerpties file not exists or not readable');
            return;
        }

        // initalizing the reader object.
        this.reader = createInterface({
            input: require('fs').createReadStream(this.path)
        });

        // setting listener on reading line of reader object
        this.reader.on('line', (line) => this.emit('line', line));

        // setting listeners on complete the reading of file.
        this.reader.on('close', (line) => this.emit('finish', line));
    }

    /**
     * 
     * @param String line The each line of the .properties file to parse
     * @return void
     */
    parse(line)
    {
        // regex to grab the left and right side of = sign 
        let regex = new RegExp('(^[a-zA-Z0-9][a-zA-Z0-9._]*?)\=(.*)');

        // running the regex on a line
        let matches = line.match(regex);

        // if there is perfect match then add them into properties object
        if (matches) {
            this.properties[matches[1]] = matches[2];
        }
    }

    /**
     * @return void
     */
    finish() {
        if (this.callback) {
            this.callback(null, Object.assign({}, this.properties));
        }
    }

    /**
     * 
     * @param String message The error message if there any error in loading or reading.
     * @return void
     */
    error(message) {
        if (this.callback) {
            this.callback(message, null);
        }
    }

    /**
     * 
     * @param String path The path of the .properties file.
     * @param Function callback The callback function that will be called when finished or got a error
     * @return Object<Reader>
     */
    static init(path, callback)
    {
        return new Reader(path, callback);
    }
}

module.exports = Reader.init;