const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const selfSigned = require('openssl-self-signed-certificate');

const options = {
    key: selfSigned.key,
    cert: selfSigned.cert
};

const app = express();
const httpsServer = https.createServer(options, app);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// canonHome
const {
    findCanon,
    updateCanon,
    removeCanon,
    insertCanon,
    indexCanon
} = require('./canonHome')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// canonHome Database Name
const canonDbName = 'canonhome'

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

/**
 * canonHome项目接口
 * start
 */

const addCanonData = (params, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(canonDbName);

        insertCanon(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

const findCanonData = (params, callback) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(canonDbName);

        findCanon(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

const deleteCanonData = (params, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);

        const db = client.db(canonDbName);

        removeCanon(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

// 查询接口findData
app.all('/list', (req, res) => {
    res.status(200);
    findCanonData(req.body, jsonData => {
        res.json(jsonData)
    });
});

app.all('/save',function(req, res, next){
    const arr = Object.keys(req.body);
    
    res.status(200);
    if (arr.length) {
        addCanonData(req.body, () => {
            res.json({
                success: true,
                data: {a: 111}
            })
        });
    } else {
        res.json({
            success: true
        })
    }
});

app.all('/delete', (req, res) => {
    res.status(200);
    deleteCanonData(req.query, jsonData => {
        res.json(jsonData)
    });
})

/**
 * canonHome项目接口
 * end
 */

//配置服务端口
// Serve the files on port 443.for https
httpsServer.listen(443, () => {
    console.log('Example app listening on port 443!\n');
});
