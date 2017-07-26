var mongoose = require('mongoose');


var MediaSchema = new mongoose.Schema({
    picture: String,
    user_id: String,
    email:String

});

module.exports = mongoose.model('Media', MediaSchema);