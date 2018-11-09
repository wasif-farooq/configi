# Configy
This package enable to seperate you development envioment config with production enviorment configs. So every enviorment have there seperate properties file. This also provide the command to generate configs that you can run on building process of your project.

## Getting Started
For configure this you need to install the package and create 2 files that mentioned below.

### Instalation
`npm install configy --save`

### File To Create
- .properties
- config/config.template.json

#### Properties File Format
below is the format how you can define the property
db.name=test
db.host=localhost

#### Define Template File
you can use the property as merge field in you config.template.json file like below
```
{
   "db": {
       "host": "{{db.host}}",
       "port": "{{db.port}}"
   }
}
```

### How to use use config in you project
you need to require the package
```
`const configy = require('configy');
```
and then need to get the config path like this

```
configy.get('db.name');
```
this will return the value of db.name in our case its a string and
```
 configy.get('db');
 ```
 this will return the you the value of "db" key that in our case is a object.

 ### License
 This project is licensed under the MIT License.

