const pageBean = {
  currentPage: 1,
  pageSize: 10,
  totalNum: 0,
  isMore: 0,
  items: [],
};

module.exports = async (model, query, currentPage, pageSize, sortQuery = { _id: -1 }) => {
  const offset = pageSize * (currentPage - 1) || 0;
  const items = await model.find(query).limit(pageSize).skip(offset).sort(sortQuery);
  const totalNum = await model.countDocuments(query);
  return {
    items,
    currentPage,
    pageSize,
    totalNum,
    isMore: totalNum > currentPage * pageSize ? 1 : 0,
  };
};
