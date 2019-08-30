/* eslint-disable global-require */

// 查询条件格式化
const searchQueryFormat = require('../util/searchQueryFormat');
// 分页方法 传递Model，查询条件
const pageHelper = require('../util/pageHelper');

module.exports = {
  async baseGetAll(ctx, next) {
    try {
      const fileName = ctx.url.split('/')[1];
      const Model = require(`${__dirname}/package/${fileName}/model`);
      const pageSize = ctx.query.pageSize * 1 || 10; // 默认一页10条
      const currentPage = ctx.query.currentPage * 1 || 1; // 默认第一页
      const query = searchQueryFormat(ctx, Model);
      const pageBean = await pageHelper(Model, query, currentPage, pageSize);
      ctx.success(pageBean);
    } catch (error) {
      console.log(error);
      ctx.error(400, 'Invalid entity');
    }
  },

  async baseGetById(ctx, next) {
    try {
      const fileName = ctx.url.split('/')[1];
      const Model = require(`${__dirname}/package/${fileName}/model`);
      const {
        id,
      } = ctx.params;
      const record = await Model.findById(id);
      ctx.success(record);
    } catch (error) {
      console.log(error);
      ctx.error(400, 'Invalid id');
    }
  },

  async basePost(ctx, next) {
    try {
      const fileName = ctx.url.split('/')[1];
      const Model = require(`${__dirname}/package/${fileName}/model`);
      const model = new Model({
        ...ctx.request.body,
      }, false);
      const record = await model.save();
      ctx.success(record);
    } catch (error) {
      console.log(error);
      ctx.error(400, 'Invalid entity');
    }
  },
  async basePut(ctx, next) {
    try {
      const fileName = ctx.url.split('/')[1];
      const Model = require(`${__dirname}/package/${fileName}/model`);
      const model = new Model({
        ...ctx.request.body,
      }, false);
      const record = await Model.findByIdAndUpdate(ctx.request.body._id, model, {});
      ctx.success(model);
    } catch (error) {
      console.log(error);
      ctx.error(400, 'Invalid entity');
    }
  },

  // 根据id批量删除,id为string或数组
  async baseDel(ctx, next) {
    try {
      const fileName = ctx.url.split('/')[1];
      const Model = require(`${__dirname}/package/${fileName}/model`);
      let {
        id,
      } = ctx.query;
      if (!id) {
        ctx.error(400, 'Invalid id');
        return;
      }
      try {
        if (Array.isArray(id)) {
          console.log(`multipul delete, ${id}`);
        } else {
          id = id.split(',');
        }
        id = {
          $in: id,
        };
        const record = await Model.remove({
          _id: id,
        });
        ctx.success(record);
      } catch (error) {
        ctx.error(400, 'Invalid id');
      }
    } catch (error) {
      console.log(error);
      ctx.error(400, 'Invalid id');
    }
  },
};
