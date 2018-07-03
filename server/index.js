const express = require('express');

const app = express();

// mongodb
const {
    findDocuments,
    updateDocument,
    removeDocument,
    insertDocuments,
    indexCollection
} = require('./mongodb')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'site';

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

let lookData = (params, callback) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findDocuments(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

let addData = (params, callback) => {
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        insertDocuments(params, db, res => {
            callback(res);
            client.close();
        })
    });
}

let deleteData = (params, flag, callback) => {
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        removeDocument(params, db, flag, () => {
            findDocuments({}, db, res => {
                callback(res);
                client.close();
            });
        })
    });
}

//写个接口123
app.all('/123', (req, res) => {
    res.status(200);
    // console.log(2)
    deleteData({ a: 2 }, 'many', jsonData => {
        res.json(jsonData);
        // console.log(res)
    })
    // lookData({}, jsonData => {
    //     res.json(jsonData)
    // })
    // let jsondata = lookData({ name: "weare2" });
    
});


// 开发模式
// app.use(webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath
// }));


// 调用本地静态资源
// app.use(express.static('dist'));

//配置服务端口
// // Serve the files on port 3000.
app.listen(3000, () => {
    console.log('Example app listening on port 3000!\n');
});



