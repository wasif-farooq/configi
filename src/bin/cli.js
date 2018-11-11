#!/usr/bin/env node
const path = require('path');
const { Generator } = require('../lib/generator');
const params = process.argv.slice(2);

/**
 * 
 */
class Configi extends Generator
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
        super(properties, template, output);
    }

    /**
     * 
     * @param Array params The cli command paramerteds
     * @return void
     */
    static run(params)
    {
        if(!params[0]) {
            console.error('Error : no project directory was ppassed');
            process.exit(0);
        }

        if (!params[1]) {
            params[1] = process.env.NODE_ENV || 'dev';
        }

        let dir = path.resolve(params[0]);
        let properties = path.join(dir, '.properties');
        let template = path.join(dir, 'config', 'config.template.json');
        let output = path.join(dir, 'config', 'config.' + params[1] + '.json');

        let generator = new this(properties, template, output);

        generator.on('finish', function() {
            console.log('Done');
        });
    }
};

Configi.run(params);