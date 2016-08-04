# angular-wepack-gulp-demo

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