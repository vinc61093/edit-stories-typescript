let webpack = require('./webpack.config');
webpack.output.publicPath = 'https://storiesedit.planoly.com/';
module.exports = webpack;
