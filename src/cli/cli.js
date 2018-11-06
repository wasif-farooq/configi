#!/usr/bin/env node
const path = require('path');
const read = require('./lib/read');
const params = process.argv.slice(2);
const source = params[0];

read(path.resolve(source), { path: true, namespaces:true }, function(err, data) {
    if (err) {
        console.error(err);
    }

    console.log(data);
})

//var stdio = require('stdio');
//console.log(process.stdin);
/*var ops = process.stdin.getopt({
    'check': {key: 'c', args: 2, description: 'What this option means'},
    'map': {key: 'm', description: 'Another description'},
    'kaka': {args: 1, mandatory: true},
    'ooo': {key: 'o'}
});

console.log(ops);*/