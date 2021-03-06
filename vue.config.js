const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
  outputDir: process.env.outputDir,
  assetsDir: 'static',
  // baseUrl: './', // 资源文件的目录
  publicPath: './', // 资源文件的目录
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
  filenameHashing: true,
  devServer: {
    port: 9527,
    https: false,
    host: '0.0.0.0',
    open: true, // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'https://api.it919.cn/index.php/',
        ws: true,
        changeOrigin: true
      }
    }
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')(),
          require('postcss-pxtorem')({
            rootValue: 75,
            unitPrecision: 5, // 保留小数位
            selectorBlackList: ['bb_1'], // 过滤的类名
            replace: true, // 默认直接替换属性
            propList: ['*'],
            propWhiteList: ['*'],
            MinPixelValue: 2 // 设置最小转化的px值，貌似不起作用 Px
          })
        ]
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios',
        'es6-promise/auto': 'ES6Promise'
      }
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
    } else {
      // 为开发环境修改配置...
    }
  },
  // 三方插件的选项
  pluginOptions: {
    // vconsole: {enable: process.env.NODE_ENV !== 'production'}
  }
}
