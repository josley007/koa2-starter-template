/* eslint-disable */
const fs = require('fs');
const router = require('koa-router')();
const {
    baseGetAll,
    baseGetById,
    basePost,
    basePut,
    baseDel
} = require('./baseController')

function addMapping(router, mapping, prefix = '', model = null) {
    for (const url in mapping) {
        if (url.startsWith('GET ')) {
            var path = prefix + url.substring(4);
            if (!mapping[url] && model) {
                if (url === 'GET /') {
                    router.get(path, baseGetAll)
                    console.log(`Auto register [baseGetAll]: GET ${path}`);
                } else if (url === 'GET /:id') {
                    router.get(path, baseGetById)
                    console.log(`Auto register [baseGetById]: GET ${path}`);
                }
                continue;
            }
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = prefix + url.substring(5);
            if (!mapping[url] && model) {
                router.post(path, basePost)
                console.log(`Auto register [basePost]: POST ${path}`);
                continue;
            }
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = prefix + url.substring(4);
            if (!mapping[url] && model) {
                router.put(path, basePut)
                console.log(`Auto register [basePut]: POST ${path}`);
                continue;
            }
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DEL ')) {
            var path = prefix + url.substring(4);
            if (!mapping[url] && model) {
                router.del(path, baseDel)
                console.log(`Auto register [baseDel]: POST ${path}`);
                continue;
            }
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DEL ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addController(router) {
    const basePath = `${__dirname}/package`
    const files = fs.readdirSync(basePath);
    for (const f of files) {
        const filePath = `${basePath}/${f}`
        if (fs.statSync(filePath).isDirectory() && fs.existsSync(`${filePath}/controller/index.js`) && !f.endsWith('-disable')) {
            let filename = `/${f}`
            if (filename === '/home') filename = ''
            console.log(`process controller: /${f}...`);
            let model = null
            if (fs.existsSync(`${filePath}/model/index.js`)) {
                model = require(`${filePath}/model/index.js`)
            }
            const mapping = require(`${filePath}/controller/index.js`);
            addMapping(router, mapping, filename, model)
        }
    }
}
module.exports = () => {
    // 扫描 /src/package下带有controller的文件夹，自动注册controller/index.js 里导出的路由。
    addController(router);
    return router.routes();
};