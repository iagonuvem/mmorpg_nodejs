var MongoModule = require('mongodb').MongoClient;
 
const url = 'mongodb://localhost:27017';
const dbName = 'got';
 
function dbConnection(){
 this._MongoClient = undefined;
 this._MongoDB = undefined;
}
 
dbConnection.prototype.connectToMongo = function(callback){
 
  MongoModule.connect(url, { useNewUrlParser: true }, function(err, client) {
  //console.log("Server Conectado Com Sucesso!");
  var MongoClient = client;
  var MongoDB = client.db(dbName);
  
  return callback(MongoClient, MongoDB);
  });
 
}
 
module.exports = function(){
 return dbConnection;
}