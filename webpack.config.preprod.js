let webpack = require('./webpack.config');
webpack.output.publicPath = 'https://preprod-storiesedit.planoly.com/';
module.exports = webpack;
