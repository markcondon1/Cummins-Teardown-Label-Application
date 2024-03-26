const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appIndexJs = path.resolve(__dirname, 'frontend/src/index.js');
        paths.appSrc = path.resolve(__dirname, 'frontend/src');
        return paths;
    },
};
