const assert = require('assert');

const findDocuments = function (params, db, callback) {
    // Get the documents collection
    const collection = db.collection('weare');
    // Find some documents
    collection.find(params).toArray(function (err, docs) {
        assert.equal(err, null);
        // console.log("Found the following records");
        // console.log(docs);
        callback(docs);
    });
}

const updateDocument = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ a: 2 }
        , { $set: { b: 1 } }, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
}

const insertDocuments = function (params, db, flag, callback) {
    // Get the documents collection
    const collection = db.collection('weare');
    // Insert some documents

    if (flag === 'one') {
        collection.insertOne(params, function (err, result) {
            assert.equal(err, null);
            // assert.equal(3, result.result.n);
            // assert.equal(3, result.ops.length);
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

const indexCollection = function (db, callback) {
    db.collection('weare').createIndex(
        { "a": 1 },
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