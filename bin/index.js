const express = require('express'), app = express(), router = express.Router;
const http = require('http').Server(app),path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');

const response = require('./response');
const fileUpload = require('express-fileupload');

require('dotenv').config()

mongoose.connect('mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME);

app.use(express.static( path.resolve(__dirname, '..', 'public') ) );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(response);

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use(fileUpload());

routes(app,router);

http.listen(process.env.PORT || 8080, function(){
  console.log('listening on *:' + process.env.PORT || 8080);
});
