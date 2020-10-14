const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463
   */
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {},

  chainWebpack: (config) => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#0493f3'
          /* 'link-color': '#F5222D',
          'border-radius-base': '4px', */

        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 3000,
    proxy: {
      /* '/api': {
         target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro', //mock API接口系统
         ws: false,
         changeOrigin: true,
         pathRewrite: {
           '/ecidi-cmp': ''  //默认所有请求都加了ecidi-cmp前缀，需要去掉
         }
       }, */
      '/xs': {
        // target: 'http://127.0.0.1:8081', // xs数据服务系统
        target: 'https://10.215.6.195:8843', // xs数据服务系统
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/ecidi-cmp/xs': '/ecidi-cmp' // 默认所有请求都加了xs前缀，需要去掉
        }
      },
      '/ecidi-cmp': {
        // target: 'http://192.168.1.57:8080', // 工程云后端 不加密
        // target: 'https://39.170.3.23:8001', // 工程云后端 加密
        // target: 'http://10.215.142.15:8082/ecidi-cmp', //请求服务器eurekr后台  需要ecidi-cmp后台项目
        // target: 'http://127.0.0.1:8080', // 请求本地服务 需要ecidi-cmp后台项目
        target: 'https://10.215.6.195:8842', // 请求本地服务 需要ecidi-cmp后台项目
        ws: false,
        changeOrigin: true
      },
      '/cmp-flow': {
        target: 'http://10.215.142.15:8079', // 请求服务器后台
        // target: 'http://10.215.142.15:8082/ecidi-cmp', //请求服务器eurekr后台  需要ecidi-cmp后台项目
        // target: 'http://127.0.0.1:8079', //请求本地服务 需要cmp-flow后台项目
        ws: false,
        changeOrigin: true
      }
    }
  },

  lintOnSave: undefined
}
