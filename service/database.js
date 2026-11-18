const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const database = client.db('cellsim');
const userCollection = database.collection('user');
const scoreCollection = database.collection('score');
const settingsCollection = database.collection('settings');

(async function testConnection() {
  try {
    await database.command({ ping: 1 });
    console.log('Connected to database');
  } catch (error) {
    console.error(`Unable to connect to database: ${error.message}`);
    process.exit(1);
  }
})();

module.exports = {
  userCollection,
  scoreCollection,
  settingsCollection,
};
