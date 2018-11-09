#!/usr/bin/env node
const path = require('path');
const { Generator } = require('./lib/generator');
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
    constructor(properties, template, output) {
        super(properties, template, output);
    }

    /**
     * 
     * @param {array} params 
     */
    static run(params) {
        if(!params[0]) {
            console.error('Error : no project directory was ppassed');
            process.exit(0);
        }

        if (!params[1]) {
            params[1] = 'dev';
        }

        const dir = path.resolve(params[0]);
        const properties = path.join(dir, '.properties');
        const template = path.join(dir, 'config', 'config.template.json');
        const output = path.join(dir, 'config', 'config.' + params[1] + '.json');

        const generator = new this(properties, template, output);

        generator.on('finish', function() {
            console.log('Done');
        });

        generator.on('error', function(data) {
            console.log('Error : ' + data);
            process.exit(0);
        });
    }
};

Configy.run(params);