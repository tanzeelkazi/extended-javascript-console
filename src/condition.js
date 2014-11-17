// takes a raw input and determines its
// primitive type.  Outputs all input as a string.
define(['get-type'],
function (getType) {
    "use strict";
    function condition (blob) {
        var type = getType(blob);
        switch (type) {
            case 'number':
            case 'boolean':
            case 'function':
                blob = blob.toString();
                break;
            case 'object':
            case 'array':
            case 'null':
                blob = JSON.stringify(blob);
                break;
            case 'undefined':
                blob = 'undefined';
                break;
        }
        return {
            "type": type,
            "text": blob
        };
    }
    return condition;
});
