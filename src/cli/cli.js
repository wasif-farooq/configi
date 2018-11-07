#!/usr/bin/env node
const path = require('path');
const { Generator } = require('./lib/generator');
const params = process.argv.slice(2);
const source = path.join(path.resolve(params[0]),'.properties');
const env = process.env.NODE_ENV || 'development';
const destination = path.join(path.dirname(source), 'config', 'config.' + env + '.json');

const generator = new Generator(source, destination);
generator.on('finish', function() {
    console.log('Done');
});