var mongoose = require('mongoose');
var fileSchema = mongoose.Schema({
  uid: String,
  url: String
});

module.exports = mongoose.model('File', fileSchema);
