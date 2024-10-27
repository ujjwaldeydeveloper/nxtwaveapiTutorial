const { MongoClient  } = require('mongodb');

let dbConnection;

// localhost can be replace with 0.0.0.0
let uri = 'mongodb://0.0.0.0:27017/dbNxtWave';

module.exports = {
    connectToDb: (callback) => {
        MongoClient.connect(uri)
         .then((client) => {
            dbConnection = client.db();
            return callback();
         })
         .catch(err => {
            console.log(err);
            return callback(err);
         });
    },
    getDb: () => dbConnection,
}