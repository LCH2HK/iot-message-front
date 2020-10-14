Overview
----



#### 前端技术
 
- 基础框架：[ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- JavaScript框架：Vue
- Webpack
- node
- yarn
- eslint
- @vue/cli 3.2.1
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现



项目下载和运行
----

- 拉取项目代码
```bash
git clone http://cmp.ecidi.com:8001/cmp/cmp-front.git
cd  cmp-front
```
 - 安装前端工具
 
1、安装 Nodejs	JavaScript运行环境，此处使用到它的包管理器npm	http://www.jianshu.com/p/03a76b2e7e00
2、安装 yarn ，命令行下面： npm install yarn -g 



- 安装依赖run 
```
yarn install
```
若出现如下错误：

error An unexpected error occurred: "ENOENT: no such file or directory, copyfile
 'C:\\Users\\chen_m2\\AppData\\Local\\Yarn\\Cache\\v4\\npm-@babel-plugin-proposa
l-unicode-property-regex-7.4.4-501ffd9826c0b91da22690720722ac7cb1ca9c78\\node_mo
dules\\@babel\\plugin-proposal-unicode-property-regex\\test\\fixtures\\without-u
nicode-flag\\script-extensions\\input.js' -> 'F:\\ecidi\\cmc2\\ant-design-jeecg-
vue\\node_modules\\@babel\\plugin-proposal-unicode-property-regex\\test\\fixture
s\\without-unicode-flag\\script-extensions\\input.js'".


则执行以下三个个步骤：

1、将‘C:\Users\ecidi\AppData\Local\Yarn\Cache\v4\npm-@babel-plugin-proposal-unicode-property-regex-7.4.4-501ffd9826c0b91da22690720722ac7cb1ca9c78\node_modules\@babel\plugin-proposal-unicode-property-regex\test\fixtures\without-unicode-flag\script-extensions’
目录下的两个文件‘input.js’和‘output.js’复制到‘cmp-front’文件夹下的‘node_modules\@babel\plugin-proposal-unicode-property-regex\test\fixtures\without-unicode-flag\script-extensions’目录中。

2、将‘C:\Users\ecidi\AppData\Local\Yarn\Cache\v4\npm-@babel-plugin-proposal-unicode-property-regex-7.4.4-501ffd9826c0b91da22690720722ac7cb1ca9c78\node_modules\@babel\plugin-proposal-unicode-property-regex\test\fixtures\with-unicode-flag\script-extensions’
目录下的两个文件‘input.js’和‘output.js’复制到‘cmp-front’文件夹下的‘node_modules\@babel\plugin-proposal-unicode-property-regex\test\fixtures\with-unicode-flag\script-extensions’目录中。

3、重新执行 yarn install



- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他说明
----

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```






备注
----

> @vue/cli 升级后，eslint 规则更新了。由于影响到全部 .vue 文件，需要逐个验证。既暂时关闭部分原本不验证的规则，后期维护时，在逐步修正这些 rules