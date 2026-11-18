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

function getUser(email) {
  return userCollection.findOne({ email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token });
}

function addUser(user) {
  return userCollection.insertOne(user);
}

function updateUser(user) {
  return userCollection.replaceOne({ email: user.email }, user);
}

function addScore(score) {
  return scoreCollection.insertOne(score);
}

function getHighScores() {
  return scoreCollection.find({}, { sort: { score: -1 }, limit: 10 }).toArray();
}

function getSettings(user) {
  return settingsCollection.findOne({ email: user.email });
}

function saveSettings(user, settings) {
  return settingsCollection.replaceOne({ email: user.email }, { email: user.email, ...settings }, { upsert: true });
}

module.exports = {
  userCollection,
  scoreCollection,
  settingsCollection,
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addScore,
  getHighScores,
  getSettings,
  saveSettings,
};
