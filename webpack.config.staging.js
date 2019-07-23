let webpack = require('./webpack.config');
webpack.output.publicPath = 'https://staging-storiesedit.planoly.com/';
module.exports = webpack;
