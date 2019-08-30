/*
 *  controller 自动注册
 * 除home文件之外的文件名为注册到router上的前缀路径
 * user.js 即为 '/user'
 */
// 引入表对象
const Model = require('../model');
// 查询条件格式化
const searchQueryFormat = require('../../../../util/searchQueryFormat');
// 分页方法 传递Model，查询条件
const pageHelper = require('../../../../util/pageHelper');

module.exports = {};
