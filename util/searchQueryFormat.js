// 排除既定的查询关键字
const {
  queryMap,
} = require('../config/dataMap');


module.exports = (ctx, Model) => {
  const query = {};
  for (const i in ctx.query) {
    if (ctx.query[i] && ctx.query[i] !== '' && ctx.query[i] !== null && ctx.query[i] !== 'null') {
      if (queryMap.findIndex(e => e === i) === -1 && Model.schema.paths[i]) {
        if (Model.schema.paths[i].instance === 'Number' || Model.schema.paths[i].instance === 'ObjectID') {
          query[i] = ctx.query[i];
        } else if (Model.schema.paths[i].instance === 'Date') {
          query[i] = {
            $gte: ctx.query[i],
          };
        } else if (Array.isArray(ctx.query[i])) {
          query[i] = {
            $in: ctx.query[i],
          };
        } else {
          query[i] = {
            $regex: new RegExp(`${ctx.query[i]}`, 'i'),
          };
        }
      }
    }
  }
  return query;
};
