/*
 * @Author: dongdong.wu
 * @Date: 2021-01-18 09:57:38
 * @LastEditTime: 2021-01-18 10:08:19
 * @FilePath: \welink-template\src\router\export-modules-router.js
 * @Description: 用于本地开发路由。线上是动态生成路由表
 */
let exportMoudelsRouters = []; // 存储下路由数据
const modulesRouters = require.context("./modules", true, /\.js$/);
modulesRouters.keys().forEach(moudlesPath => {
  exportMoudelsRouters = exportMoudelsRouters.concat(
    modulesRouters(moudlesPath).default
  );
});
console.log('【./src/router/export-modules-router.js】 模块路由集合：',exportMoudelsRouters)
export default exportMoudelsRouters;
console.log('==>模块路由文件[./src/router/export-modules-router.js]')
