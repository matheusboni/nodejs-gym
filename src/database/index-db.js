const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/gym', {useMongoClient : true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
