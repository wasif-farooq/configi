function flat(data) {

    var output = {};

    function convert(obj, prev) {
        Object.keys(obj).forEach(function(key) {

            var val = obj[key];
            var isArray = Array.isArray(val);
            var type = Object.prototype.toString.call(val);
            var isObject = (
                type === '[object Object]' ||
                type === '[object Array]'
            );

            var path = prev ? prev + '.' + key: key;

            if (isArray ||
                (isObject && Object.keys(val).length)
            ) {
                output[path] = val;
                return convert(val, path);
            }

            output[path] = val;

        });
    }

    convert(data);
    return output;

};

module.exports = flat;