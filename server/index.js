const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

const findData = (params, callback) => {
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

const addData = (params, callback) => {
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        insertDocuments(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

const deleteData = (params, flag, callback) => {
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);

        const db = client.db(dbName);

        removeDocument(params, db, flag, res => {
            callback(res);
            client.close();
        });
    });
}

const updateData = (params, flag, callback) => {
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);

        const db = client.db(dbName);

        updateDocument(params, db, flag, res => {
            callback(res);
            client.close();
        });
    });
}

const indexData = (params, callback) => {
    MongoClient.connect(url, (err, client) => {
        assert.equal(null, err);

        const db = client.db(dbName);

        indexCollection(params, db, res => {
            callback(res);
            client.close();
        });
    });
};

// 查询接口findData
app.all('/findData', (req, res) => {
    res.status(200);
    findData(req.body, jsonData => {
        res.json(jsonData)
    });
});

// 添加接口addData
app.all('/addData', (req, res) => {
    res.status(200);
    addData(req.body, jsonData => {
        res.json(jsonData)
    });
});

// 删除接口deleteData
app.all('/deleteData', (req, res) => {
    res.status(200);
    deleteData(req.body.data, req.body.flag, jsonData => {
        res.json(jsonData)
    });
});

// 更新接口updateData
app.all('/updateData', (req, res) => {
    res.status(200);
    updateData(req.body, req.body.flag, jsonData => {
        res.json(jsonData)
    });
});

app.all('/indexData', (req, res) => {
    res.status(200);
    indexData({ a: 777 }, jsonData => {
        res.json(jsonData)
    });
});

//配置服务端口
// // Serve the files on port 3000.
app.listen(3000, () => {
    console.log('Example app listening on port 3000!\n');
});



