/* eslint-disable guard-for-in */
const XLSX = require('xlsx');

function makeBook(data) {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  return wb;
}

function getData(data = [['测试数据', 'A', 'B'], ['1', 'a', 'b']]) {
  return new Promise((resolve) => {
    const wb = makeBook(data);
    resolve(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', compression: true }));
  });
}

/*
    * 将json数据转成sheet数据
    * */
function toSheet(params) {
  if (!params) return [];
  try {
    const { sheetName = [] } = params;
    const { datas } = params;
    const _datas = [];
    const tableHeader = [];
    datas.forEach((data, index) => {
      const _data = [];
      for (const key in sheetName) {
        if (index === 0) {
          tableHeader.push(sheetName[key] || key);
        }
        const cellValue = data[key] || '';
        _data.push(cellValue.toString());
      }
      if (index === 0) {
        _datas[0] = tableHeader;
      }
      _datas.push(_data);
    });
    return _datas;
  } catch (error) {
    return [];
  }
}

module.exports = {
  makeBook,
  getData,
  toSheet,
};
