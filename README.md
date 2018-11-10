# Configy
This package enable to seperate you development envioment config with production enviorment configs. So every enviorment have there seperate properties file. This also provide the command to generate configs that you can run on building process of your project.

## Getting Started
For configure this you need to install the package and create 3 files that mentioned below.

### Instalation
`npm install configy --save`

### File To Create
- .properties
- .properties.sample
- config
    - config.template.json

add .properties file in .gitignore if you are using the git.

#### Command to generate files
```
configy direcotory_path ot .properties files enviorment
```
- enviorment either be dev or prod if you not pass this argument it will get the NODE_ENV and if that is not set it take dev by default.

Like
```
configy /var/www/html/app prod
```

#### Properties File Format
below is the format how you can define the property
db.name=test
db.host=localhost
db.port=3305

#### Define Template File
you can use the property as merge field in you config.template.json file like below
```
{
   "db": {
       "name": "{{db.name}}",
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

