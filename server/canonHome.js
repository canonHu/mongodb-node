const assert = require('assert');

const findCanon = function (params, db, callback) {
    // Get the documents collection
    const collection = db.collection('canon');
    // Find some documents
    collection.find(params).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const updateCanon = function (params, db, callback) {
    // Get the documents collection
    const collection = db.collection('canon');
    // Update document where a is 2, set b equal to 1
    if (params.length === 1) {
        collection.updateOne({ name: params[0].name, articleId: params[0].articleId }
            , { $set: params[0] }, function (err, result) {
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

const insertCanon = function (params, db, callback) {
    // Get the documents collection
    const collection = db.collection('canon');
    // Insert some documents
    // collection.find({ name: params.name }).toArray(function (err, docs) {
    //     assert.equal(err, null);

    //     if (params.length === 1) {
            collection.insertOne(params, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted 3 documents into the collection");
                callback(result);
            });
        // } else {
        //     collection.insertMany(params, function (err, result) {
        //         assert.equal(err, null);
        //         // assert.equal(3, result.result.n);
        //         // assert.equal(3, result.ops.length);
        //         console.log("Inserted 3 documents into the collection");
        //         callback(result);
        //     });
        // }
    // });
}

const removeCanon = function (params, db, callback) {
    const id = parseInt(params.id, 10)
    // Get the documents collection
    const collection = db.collection('canon');
    // Delete document where a is 3
    // collection.find({ id: params.id }).toArray(function (err, docs) {
        // assert.equal(err, null);
        // if (params.length === 1) {
            collection.deleteOne({ id }, function (err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                callback(result);
            });
        // } else {
            // collection.deleteMany(params.id, function (err, result) {
            //     assert.equal(err, null);
            //     callback(result);
            // });
        // }
    // })
}

const indexCanon = function (params, db, callback) {
    db.collection('canon').createIndex(
        params,
        null,
        function (err, results) {
            callback();
        }
    );
};

module.exports = {
    findCanon,
    updateCanon,
    removeCanon,
    insertCanon,
    indexCanon
}