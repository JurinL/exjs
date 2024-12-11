const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/mydatabase';

mongoose.connect(mongoURI, {
}).then(() => {
  console.log('Connected to MongoDB container');
}).catch((err) => {
  console.error('Failed to connect to MongoDB container', err);
});