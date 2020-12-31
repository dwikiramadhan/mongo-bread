const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbname = 'data_type';

const mongoClient = async function (cb) {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    cb(client)
}

module.exports = { mongoClient }