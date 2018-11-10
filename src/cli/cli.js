#!/usr/bin/env node
const path = require('path');
const { Generator } = require('../lib/generator');
const params = process.argv.slice(2);

/**
 * 
 */
class Configy extends Generator
{
    /**
     * 
     * @param {*} properties 
     * @param {*} template 
     * @param {*} output 
     */
    constructor(properties, template, output)
    {
        super(properties, template, output);
    }

    /**
     * 
     * @param {array} params 
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

Configy.run(params);