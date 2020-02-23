(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
        ? define(factory)
        : ((global = global || self), (global.JcURL = factory()));
})(this, function() {
    'use strict';

    function getParams(url) {
        url = url || window.location.href;
        var params = {};
        var splitUrl = url.split('?', 2);
        var queries = splitUrl.length === 2 ? splitUrl[1].split('&') : [];
        queries.forEach(function(query) {
            var row = query.split('=', 2);
            var key = row[0];
            var value = row[1] || '';

            if (key.substr(-2) === '[]') {
                key = key.substr(0, key.length - 2);

                if (params[key] === undefined) {
                    params[key] = [];
                }

                params[key].push(decodeURIComponent(value));
            } else {
                params[key] = decodeURIComponent(value);
            }
        });
        return params;
    }

    function addParams(url, newParams) {
        if (newParams instanceof Object) {
            var uri = url.split('?', 2)[0];
            var currentParams = getParams(url);

            for (var key in newParams) {
                if (newParams.hasOwnProperty(key)) {
                    var value = newParams[key];

                    if (Array.isArray(value) && value.length) {
                        if (
                            currentParams[key] === undefined ||
                            !Array.isArray(currentParams[key])
                        ) {
                            currentParams[key] = [];
                        }

                        for (var i = 0; i < value.length; i++) {
                            currentParams[key].push(value[i]);
                        }
                    } else {
                        currentParams[key] = newParams[key];
                    }
                }
            }

            var queries = [];

            for (var _key in currentParams) {
                var _value = currentParams[_key];

                if (Array.isArray(_value) && _value.length) {
                    for (var j = 0; j < _value.length; j++) {
                        queries.push(''.concat(_key, '[]=').concat(_value[j]));
                    }
                } else {
                    queries.push(''.concat(_key, '=').concat(_value));
                }
            }

            url = ''.concat(uri, '?').concat(queries.join('&'));
        }

        return url;
    }

    var url = {
        getParams: getParams,
        addParams: addParams
    };

    return url;
});
