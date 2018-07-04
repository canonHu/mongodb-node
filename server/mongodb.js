const assert = require('assert');

const findDocuments = function (params, db, callback) {
    // Get the documents collection
    const collection = db.collection('weare');
    // Find some documents
    collection.find(params).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const updateDocument = function (params, db, flag, callback) {
    // Get the documents collection
    const collection = db.collection('weare');
    // Update document where a is 2, set b equal to 1
    if (flag === 'one') {
        collection.updateOne(params.query
            , { $set: params.set }, function (err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Updated the document with the field a equal to 2");
                callback(result);
            });
    } else {
        collection.updateMany(params.query
            , { $set: params.set }, function (err, result) {
                assert.equal(err, null);
                console.log("Updated the document with the field a equal to 2");
                callback(result);
            });
    }
}

const insertDocuments = function (params, db, callback) {
    // Get the documents collection
    const collection = db.collection('weare');
    // Insert some documents

    if (params.length === 1) {
        collection.insertOne(params[0], function (err, result) {
            assert.equal(err, null);
            console.log("Inserted 3 documents into the collection");
            callback(result);
        });
    } else {
        collection.insertMany(params, function (err, result) {
            assert.equal(err, null);
            // assert.equal(3, result.result.n);
            // assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the collection");
            callback(result);
        });
    }
}

const removeDocument = function (params, db, flag, callback) {
    // Get the documents collection
    const collection = db.collection('weare');
    // Delete document where a is 3
    if (flag === 'one') {
        collection.deleteOne(params, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            callback(result);
        });
    } else {
        collection.deleteMany(params, function (err, result) {
            assert.equal(err, null);
            callback(result);
        });
    }
}

const indexCollection = function (params, db, callback) {
    db.collection('weare').createIndex(
        params,
        null,
        function (err, results) {
            console.log(results);
            callback();
        }
    );
};

module.exports = {
    findDocuments,
    updateDocument,
    removeDocument,
    insertDocuments,
    indexCollection
}