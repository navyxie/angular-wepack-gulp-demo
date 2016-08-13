var path = require('path');
var fs = require('fs');
require('es6-promise').polyfill();//css-loader依赖的postcss插件最低node.js版本要求是0.12,低于该版本的需要引入es6-promise。
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");//假如是所页面应用，提取所有页面入口文件的公共引用的文件为一个公共文件
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;//压缩js文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');//忽略某些文件不进行打包，如可以忽略css文件不打包进css，需要页面手工引入
var srcDir = path.resolve(process.cwd(), 'assets');//静态文件目录
//生成manifest文件,可以利用该文件进行版本管理，如xxx.version.js
function revManifest() {
    this.plugin('done', function (stats) {
        stats = stats.compilation.getStats().toJson({
            hash: true,
            publicPath: true,
            assets: true,
            chunks: false,
            modules: false,
            source: false,
            errorDetails: false,
            timings: false
        });
        var json = {}, chunk;
        for (var key in stats.assetsByChunkName) {
            if (stats.assetsByChunkName.hasOwnProperty(key)) {
                chunk = stats.assetsByChunkName[key];
                json[key + '.js'] = chunk[0];
            }
        }
        fs.writeFileSync(
            path.join(__dirname, 'rev-manifest.json'),
            JSON.stringify(json, null, 2)
        );
    });
}
//获取多页面的入口文件（本例子中规范以_entry.js结尾的文件为入口文件）
function getEntry () {
  var jsPath = path.resolve(srcDir,'js/app');
  var dirs = fs.readdirSync(jsPath);
  var matchs = [], files = {};
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)(_entry)\.js$/);
  // console.log(matchs);
    if (matchs) {
      files[matchs[1]+matchs[2]] = path.resolve(srcDir, 'js/app', item);
    }
  });
  // console.log(JSON.stringify(files));
  return files;
}

var entry = getEntry();
entry['cookie__'] = ['cookie','_'];

module.exports = {
  // devtool: "source-map",//开发的时候设置为eval
  devtool: "eval",//开发的时候设置为eval
  entry: entry,
  output: {
    path: path.join(__dirname, 'assets/dist/js/'),
    // publicPath: 'assets/dist/js/',
    // filename: "[name].[chunkhash].js"
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: require.resolve(srcDir + '/js/common/angular/angular.js'), loader: "exports?window.angular" },//对于非模块化的库，可以通过exports插件暴露出全局变量，如angular
      { test: require.resolve(srcDir + '/js/app/util.js'), loader: "exports?window.util" },
      //{ test: /\.css$/, loader: 'style-loader!css-loader'},//
      { test: /\.css$/,loader: ExtractTextPlugin.extract("style-loader", "css-loader")},//不打包css。webpack插件执行顺序是从后往前（css->style）
    ],
    //配置webpack直接忽略不解析该文件的依赖关系。对于比较大的库很有用，如reactjs.主要提高打包速度。
    noParse: [srcDir + '/js/common/angular/angular.js',srcDir + '/js/common/cookie/cookie.js',srcDir + '/js/common/underscore/1.6.0/underscore.js']
  },
  resolve: {
    //配置别名，require时候通过别名直接引入。
    alias: {
      angular: srcDir + '/js/common/angular/angular.js',
      cookie: srcDir + '/js/common/cookie/cookie.js',
      _: srcDir + '/js/common/underscore/1.6.0/underscore.js',
      util: srcDir + '/js/app/util.js'
    }
  },
  plugins: [
    //配置全局变量，页面无需require引入可直接全局引用。
    new webpack.ProvidePlugin({
      angular: 'angular',
      util: 'util',
      cookie: 'cookie',
      _: '_'
    }),
    //提取所有入口文件公共引用的文件
    new CommonsChunkPlugin('common.js'),
    // new CommonsChunkPlugin('common.[hash].js'),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    //不打包css文件
    new ExtractTextPlugin("[name].css"),//不打包css
    function () {
      revManifest.call(this);
    }
  ],
  //这里可以配置忽略的打包文件，需要单独引入页面
  // externals: {
  //   'angular': true//angular 文件不进行打包
  // }
}