# angular-wepack-gulp-demo

## usage

1 http-server assets
2 gulp dev

## 总结

- 在引入非common文件时,需要通过exports-loader插件引入(需要安装exports-loader插件)引入方式如下:

    ```
    module: {
      loaders: [
        { test: require.resolve(srcDir + '/js/common/angular/angular.js'), loader: "exports?window.angular" },
        { test: require.resolve(srcDir + '/js/app/util.js'), loader: "exports?window.util" }
      ]
    }
    ```
    
- 当需要全局使用变量时,可以通过配置plugins的ProvidePlugin,这样文件(变量)时可以不用require('angular'),可以直接使用angular:

    ```
    plugins: [
        new webpack.ProvidePlugin({
          angular: 'angular',
          util: 'util'
          // cookie: 'cookie'
          // _: '-'
        })
    ]
    ```

- css-loader依赖的postcss插件最低node.js版本要求是0.12.故引起webpack执行报错。也可以通过安装模块"es6-promise",然后在webpack.config.js配置中引入"require('es6-promise').polyfill()"解决
    
- webpack 文件路径:  相对路径是相对当前目录。绝对路径是相对入口文件(假如入口文件是index.js,绝对路径/util.js就是和index.js在同一目录.)


中文站点:
- https://fakefish.github.io/react-webpack-cookbook/
- http://webpack.toobug.net/zh-cn