const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const https = require('https');
const selfSigned = require('openssl-self-signed-certificate');
const TITLE = '文件上传示例';
// const uilty = '/Users/canonhu/demo/mengoDB/images/';
const uilty = 'C:/canonHu/server/images/';

const options = {
    key: selfSigned.key,
    cert: selfSigned.cert
};

const app = express();
const httpsServer = https.createServer(options, app);

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

// canonHome
const {
    findCanon,
    updateCanon,
    removCanon,
    insertCanon,
    indexCanon
} = require('./canonHome')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// weare Database Name
const dbName = 'site';

// canonHome Database Name
const canonDbName = 'canonhome'

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
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

// 查询接口findData
app.all('/list', (req, res) => {
    res.status(200);
    findCanonData(req.body, jsonData => {
        res.json(jsonData)
    });
});

app.all('/save',function(request,response){
    console.log(111, request.body)
    // var name=request.body.name;
    // var data={ "success":true, "data": { "name":"hujianeng", "value":name } };
    // response.json(data);
});

/**
 * canonHome项目接口
 * end
 */

const findData = (params, callback) => {
    // Use connect method to connect to the server
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
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
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        insertDocuments(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

const deleteData = (params, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);

        const db = client.db(dbName);

        removeDocument(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

const updateData = (params, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);

        const db = client.db(dbName);

        updateDocument(params, db, res => {
            callback(res);
            client.close();
        });
    });
}

const indexData = (params, callback) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);

        const db = client.db(dbName);

        indexCollection(params, db, res => {
            callback(res);
            client.close();
        });
    });
};

// 图片上传接口uploadImages
app.all('/uploadImages', (req, res) => {
    let newPath = '';
    res.status(200);
    //创建上传表单
    const form = new formidable.IncomingForm();

    //设置编辑
    form.encoding = 'utf-8';

    //设置上传目录
    form.uploadDir = uilty;

    //保留后缀
    form.keepExtensions = true;

    //文件大小 2M
    form.maxFieldsSize = 2 * 1024 * 1024;

    // 上传文件的入口文件
    /**
     * fields: formData里传输过来的值
     * files: 上传的图片的信息
    */
    form.parse(req, function (err, fields, files) {

        if (err) {
            res.json({
                success: false,
                data: newPath
            })
            return;
        }

        var extName = '';  //后缀名
        switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if (extName.length == 0) {
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index', { title: TITLE });
            return;
        }

        const sst = 'http://172.31.84.74:5000/';
        const rel = 'http://www.canonhu.top:5000';

        let avatarName = fields.user + '.' + Math.random() + '.' + extName;
        newPath = form.uploadDir + avatarName;
        fs.renameSync(files.file.path, newPath);  //重命名
        // addData([{
        //     name: fields.user,
        //     imageUrl: sst + 'images/' + avatarName
        // }], jsonData => {
        //     res.json(jsonData)
        // });
        res.json({
            success: true,
            data: sst + 'images/' + avatarName
        })
    });
});

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
    deleteData(req.body, jsonData => {
        res.json(jsonData)
    });
});

// 更新接口updateData
app.all('/updateData', (req, res) => {
    res.status(200);
    updateData(req.body, jsonData => {
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
// Serve the files on port 443.for https
httpsServer.listen(443, () => {
    console.log('Example app listening on port 443!\n');
});

// Serve the files on port 8080.for http
// app.listen(80, () => {
//     console.log('Example app listening on port 80!\n');
// });
