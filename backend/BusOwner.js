
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://biswajit2329:T1voipAip4RSgv97@cluster0.fw5wwvc.mongodb.net/Bookbus?retryWrites=true&w=majority';
const client = new MongoClient(url);
const database='Bookbus'


async function dbconnect_BusOwner()
{
  let result=await client.connect();
  let db=result.db(database)
  return db.collection('BusOwner');
}


module.exports=dbconnect_BusOwner