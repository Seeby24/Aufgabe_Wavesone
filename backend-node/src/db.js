const mongoose = require('mongoose');

let memoryServer = null;

/**
 * Connects to MongoDB.
 * - If MONGODB_URI is set, that database is used.
 * - Otherwise an in-memory MongoDB is started (data resets on restart).
 */
async function connectDb() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log('[db] Using in-memory MongoDB (data resets on restart)');
  }

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'tasktracker' });
}

async function disconnectDb() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectDb, disconnectDb };
